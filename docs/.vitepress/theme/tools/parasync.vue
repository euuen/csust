<script setup>
import { ref } from "vue";

const paraList = ref(0)

const paras = ref(
    [
        {
            id: 0,
            name: "kp",
            progress: 0,
            start: 0,
            end: 300,
        },
        {
            id: 1,
            name: "ki",
            progress: 0,
            start: 0,
            end: 300,
        },
        {
            id: 2,
            name: "kd",
            progress: 0,
            start: 0,
            end: 300,
        },
    ]
);
const idNum = ref(3);

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

</script>

<template>
    <div>
        <div class="flex-col mt-20" style="width: 100%;">
            <div>
                <div class="mb-6" style="font-size: 2rem;">
                    <span style="color: blue;">蓝牙</span>连接状态：<span style="color: red;">未连接</span>
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
@import "tailwindcss";

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