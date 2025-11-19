<script setup>
import { ref, onMounted, watch } from "vue";

const STORAGE_KEY = 'pid_controller_data'

const paraList = ref(0)
const paras = ref();
paras.value = [
    { id: 0, name: "kp", progress: 0, start: 0, end: 300 },
    { id: 1, name: "ki", progress: 0, start: 0, end: 300 },
    { id: 2, name: "kd", progress: 0, start: 0, end: 300 }
];
const idNum = ref(3);
const BT24_SERVICE_UUID = 0xffe0; // 注意：Web Bluetooth API通常使用短UUID格式
const BT24_TX_CHARACTERISTIC_UUID = 0xffe1; // 假设用于接收模块数据（通知）
const BT24_RX_CHARACTERISTIC_UUID = 0xffe2; // 假设用于向模块发送数据（写）

let bt24Device = null;
let bt24Server = null;
let bt24Service = null;
let txCharacteristic = null; // 用于接收数据（通知）
let rxCharacteristic = null; // 用于发送数据（写）
const isBLEConnected = ref(false);

const saveToLocalStorage = () => {
  try {
    const dataToSave = {
      paras: paras.value,
      idNum: idNum.value,
      lastSaved: new Date().toISOString()
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave))
    console.log('数据已保存到 localStorage')
  } catch (error) {
    console.error('保存数据失败:', error)
  }
}

const loadFromLocalStorage = () => {
  try {
    const savedData = localStorage.getItem(STORAGE_KEY)
    if (savedData) {
      const parsedData = JSON.parse(savedData)
      
      // 验证数据格式
      if (parsedData.paras && Array.isArray(parsedData.paras)) {
        paras.value = parsedData.paras
        idNum.value = parsedData.idNum || 3
        
        console.log('数据已从 localStorage 加载')
        return true
      }
    }
  } catch (error) {
    console.error('加载数据失败:', error)
  }
  
  // 如果没有数据或加载失败，使用默认值
  console.log('使用默认数据')
  return false
}

const clearLocalStorage = () => {
  try {
    localStorage.removeItem(STORAGE_KEY)
    console.log('localStorage 数据已清除')
    
    // 重置为默认值
    paras.value = [
      { id: 0, name: "kp", progress: 0, start: 0, end: 300 },
      { id: 1, name: "ki", progress: 0, start: 0, end: 300 },
      { id: 2, name: "kd", progress: 0, start: 0, end: 300 }
    ]
    idNum.value = 3
  } catch (error) {
    console.error('清除数据失败:', error)
  }
}

const setupAutoSave = () => {
  // 监听 paras 变化，自动保存（防抖处理）
    let saveTimeout
    watch(paras, (newValue) => {
        clearTimeout(saveTimeout)
        saveTimeout = setTimeout(saveToLocalStorage, 1000); // 1秒后自动保存
    }, { deep: true });

    // 监听 idNum 变化
    watch(idNum, () => {
        clearTimeout(saveTimeout)
        saveTimeout = setTimeout(saveToLocalStorage, 1000);
    });

    // 页面关闭前保存
    window.addEventListener('beforeunload', saveToLocalStorage);
}

async function sendToMCU() {
    if (rxCharacteristic === null) return;
    let floatArray = [];
    paras.value.forEach(para => {
        floatArray.push(para.progress / 10000 * (para.end - para.start) + para.start);
    });

    // 1. 直接通过浮点数数组创建Float32Array视图
    const float32View = new Float32Array(floatArray);
    rxCharacteristic.writeValue(float32View.buffer);
}

async function setupAutoSend() {
    // 监听 paras 变化，自动保存（防抖处理）
    let saveTimeout
    watch(paras, (newValue) => {
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(sendToMCU, 100); // 1秒后自动保存
    }, { deep: true })

    // 监听 idNum 变化
    watch(idNum, () => {
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(sendToMCU, 100);
    });

    // 页面关闭前保存
    window.addEventListener('beforeunload', sendToMCU);
}

async function addNewPara() {
    paras.value.push({
        id: idNum,
        name: "修改我～",
        progress: 0,
        start: 0,
        end: 300,
    });
    idNum.value += 1;
}

async function deletePara(id) {
    const index = paras.value.findIndex(item => item.id === id)
    if (index !== -1) {
        paras.value.splice(index, 1)
    }
}

async function getDevice(){
    bt24Device = await navigator.bluetooth.requestDevice({
        filters: [{
            services: [BT24_SERVICE_UUID] // 只显示提供此特定服务的设备
        }],
        optionalServices: [BT24_SERVICE_UUID]
    });

    bt24Server = await bt24Device.gatt.connect();
    bt24Service = await bt24Server.getPrimaryService(BT24_SERVICE_UUID);

    rxCharacteristic = await bt24Service.getCharacteristic(BT24_RX_CHARACTERISTIC_UUID);
    txCharacteristic = await bt24Service.getCharacteristic(BT24_TX_CHARACTERISTIC_UUID);
}

async function connectToBLE() {
    await getDevice();
    if (bt24Device !== null){
        isBLEConnected.value = true
    }else {
        isBLEConnected.value = false
    }
    
}

async function disconnectToBLE() {
    if (bt24Device && bt24Device.gatt.connected) {
        await bt24Device.gatt.disconnect();
    }
    
    bt24Device = null;
    bt24Server = null;
    bt24Service = null;
    rxCharacteristic = null;
    txCharacteristic = null;

    isBLEConnected.value = false;
}

onMounted(() => {
    loadFromLocalStorage();
    setupAutoSave();
    setupAutoSend();
});

</script>

<template>
    <div>
        <div class="flex-col mt-20" style="width: 100%;">
            <div>
                <div class="blepanel">
                    <span style="font-size: 2rem;">蓝牙连接面板（目前只支持BT24蓝牙）</span>
                    <div style="padding: 15px;margin-top: 25px;justify-content: space-between;">
                        <span style="font-size: 1rem;">连接状态</span>

                        <span v-if="isBLEConnected" style="font-size: 2rem;color: green;">已连接</span>
                        <span v-else style="font-size: 2rem;color: red;">未连接</span>
                    </div>
                    <div v-if="isBLEConnected" style="justify-content: center;">
                        <button @click="disconnectToBLE" style="background-color: red;">断开连接</button>
                    </div>
                    <div v-else style="justify-content: center;">
                        <button @click="connectToBLE">连接</button>
                    </div>
                </div>
            </div>

            <div ref="paraList" class="para-list">
                <div class="para-item" v-for="para in paras" :key="para.id">
                    <div class="flex justify-between items-center m-2" style="width: 100%;">
                        <input type="text" v-model="para.name" style="font-size: 2rem;font-weight: 400;width: 30%;"></input>
                        <div class="flex gap-3 items-center">
                            <span>{{ (para.progress / 10000 * (para.end - para.start) + para.start).toFixed(2) }}</span>
                            <button @click="deletePara(para.id)" style="background-color: red;">删除</button>
                        </div>
                    </div>
                    <div style="gap: 1rem;">
                        <input type="number" v-model="para.start" style="width: 10%;background-color: #2f2f2f;border-radius: 5px;padding: 5px;"></input>
                        <input type="range" id="progressInput" v-model="para.progress" min="0" max="10000" style="width: 80%;">
                        <input type="number" v-model="para.end" style="width: 10%;background-color: #2f2f2f;border-radius: 5px;padding: 5px;"></input>
                    </div>
                </div>
            </div>
            
            <div class="para-item" style="position: relative;">
                <!-- 这些元素只是为了占位置用的 -->
                <div class="flex justify-between items-center m-2" style="width: 100%;">
                    <span style="font-size: 2rem;font-weight: 400;">Kd</span>
                    <div class="flex gap-3 items-center">
                        <span>{{ (progress / 100 * (end - start) + start).toFixed(2) }}</span>
                        <button style="background-color: red;">
                            <span>删除</span>
                        </button>
                    </div>
                </div>
                <div style="gap: 1rem;">
                    <input type="number" v-model="start" style="width: 10%;background-color: #2f2f2f;border-radius: 5px;padding: 5px;"></input>
                    <input type="range" id="progressInput" v-model="progress" min="0" max="100" style="width: 80%;">
                    <input type="number" v-model="end" style="width: 10%;background-color: #2f2f2f;border-radius: 5px;padding: 5px;"></input>
                </div>
                <div class="para-item" style="position: absolute; width: 100%;height: 100%;z-index: 1;top: 0;left: 0;align-items: center;justify-content: center;">
                    <button style="width: 40%;height: 70%;" @click="addNewPara">添加新参数</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
* {
    color: #f7f7f7;
}

div {
    display: flex;
}

button {
    padding: 10px 20px;
    border: none;
    border-radius: 6px;
    background: #3498db;
    color: white;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

button:hover {
    background: #2980b9;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

button:active {
    transform: translateY(0);
}

.blepanel {
    width: 100%;
    margin-top: 24px;
    flex-direction: column;
    min-width: 250px;
    background: #171717;
    padding: 40px;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.para-list {
    flex-direction: column;
}

.para-item {
    margin-top: 24px;
    flex-direction: column;
    min-width: 250px;
    background: #171717;
    padding: 40px;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}
</style>