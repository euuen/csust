<script setup lang="js">
import { onMounted, ref } from 'vue';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const wapper = ref();
const cardsbox = ref();

onMounted(()=>{
    gsap.registerPlugin(ScrollTrigger);
    let vpdoc = document.querySelector(".vp-doc")
    vpdoc.style.margin = "0"
    vpdoc.style.padding = "0"
    vpdoc.style.maxWidth = "100vw"

    const scrollbox = {
        wapper: wapper.value,
        cardsbox: cardsbox.value,
        distance: 0,
        if_leave: false,
        init() {
            this.resize();
            window.addEventListener("resize", this.resize.bind(this));
            this.create_scrolltrigger();
        },
        create_scrolltrigger() {
            ScrollTrigger.create({
                trigger: this.wapper,
                start: "top top",
                end: "bottom bottom",
                onUpdate: (self) => {
                    this.cardsbox.style.transform = `translateX(-${self.progress * this.distance}px)`;
                },
                onLeave: () => {
                    this.if_leave = true;
                },
                onEnterBack: () => {
                    this.if_leave = false;
                }
            });
        },
        resize() {
            this.distance = this.cardsbox.offsetWidth - innerWidth;
            this.wapper.style.height = `${this.distance}px`;
            if (this.if_leave) this.cardsbox.style.transform = `translateX(-${this.distance}px)`;
        }
    };
    scrollbox.init();
});

</script>

<template>
    <div style="width: 100%;display: flex;flex-shrink: 0;flex-direction: column;align-items: center;">
        <div class="empty">KEEP SCROLL</div>
        <div class="empty">KEEP SCROLL</div>
        <div ref="wapper" class="wapper">
            <div class="container">
                <div ref="cardsbox" class="cardsbox">
                    <div class="cardsbox_card">
                        CARD 1
                    </div>
                    <div class="cardsbox_card">
                        CARD 2
                    </div>
                    <div class="cardsbox_card">
                        CARD 3
                    </div>
                    <div class="cardsbox_card">
                        CARD 4
                    </div>
                </div>
            </div>
        </div>
        <div class="empty">KEEP SCROLL</div>
        <div class="empty">KEEP SCROLL</div>
    </div>
</template>

<style scoped>

* {
    margin: 0;
    padding: 0;
    font-size: 1vmin;
}

div {
    display: flex;
}

p {
    user-select: none;
}

body {
    width: 100%;
    background-color: #171717;
}

.empty {
    justify-content: center;
    align-items: center;
    width: 65rem;
    height: 40rem;
    border-radius: 5rem;
    margin: 10rem 0;
    background-color: #f7f7f7;
    font-family: impact;
    font-size: 5rem;
    color: #171717;
}

.wapper {
    position: relative;
    margin: 0;
    padding: 0;
    width: 100%;
}

.container {
    position: sticky;
    max-width: 100%;
    top: 0;
    align-items: center;
    width: 100%;
    height: 105vh;
    overflow: hidden;
}

.cardsbox_card {
    justify-content: center;
    align-items: center;
    width: 65rem;
    height: 40rem;
    border-radius: 5rem;
    background-color: #f7f7f7;
    margin-right: 20rem;
    font-family: impact;
    font-size: 5rem;
    color: #171717;
    flex-shrink: 0;
}
</style>