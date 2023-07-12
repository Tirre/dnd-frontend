<template>
    <div class="slideout">
        <div style="position: relative">
            <div ref="slideout-tab" class="slideout-tab" @click="toggleSlideout">
                <div> 
                    <p> 
                        <span class="vertical-text"> {{ tabtitle }} </span>
                        <i class="ml-2" :class="{ 'fa-solid fa-chevron-up': !showSlideout, 'fa-solid fa-chevron-down': showSlideout }"></i>
                    </p>
                    
                </div>
                
            </div>

            <div ref="slideout-content" class="slideout-content" >
                <h4 v-if="title != ''" class="text-center"> {{ title }}</h4>
                <p v-if="content != ''"> {{ content }} </p>
                <slot name="default"></slot>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data(){
            return {
                showSlideout: false
            }
        },
        props: {
            tabtitle: {
                type: String,
                required: false,
                default: function(){
                    return "Information";
                }
            },
            title: {
                type: String,
                required: false,
                default: function(){
                    return "";
                }
            },
            content: {
                type: String,
                required: false,
                default: function(){
                    return "";
                }
            }
        },
        methods: {
            toggleSlideout: function(){
                console.log("slideout-content is ", this.$refs['slideout-content'].clientHeight, " high");
                this.showSlideout = !this.showSlideout;
                if (this.showSlideout){
                    this.$refs['slideout-content'].style.right = "0px";
                    this.$refs['slideout-tab'].style.right = "400px";
                    this.$refs['slideout-tab'].style.height = this.$refs['slideout-content'].clientHeight + "px";
                } else {
                    this.$refs['slideout-content'].style.right = "-400px";
                    this.$refs['slideout-tab'].style.right = "0px";
                }
            }
        },
        mounted(){
            this.$refs['slideout-tab'].style.height = this.$refs['slideout-content'].clientHeight + "px";
        }
    }
</script>

<style scoped>

    .slideout-visible {
        right: 0px !important;
    }

    .slideout {
        position: fixed;
        width: 400px;
        height: 50vh;
        top: 25vh;
        right: -400px;
        transition-property: all;
        transition-duration: 1s;
        transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
        z-index: 500;
    }
    .slideout-tab {
        cursor: pointer;
        top: 25vh;
        right: 0px;
        position: fixed;
        /* height: 200px; */
        max-height: 50vh;
        min-height: 200px;
        height: auto;
        width: 40px;
        transition-property: all;
        transition-duration: 1s;
        transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
        box-shadow: -5px 5px 30px rgba(0, 0, 0, 0.9);
        -webkit-box-shadow: -5px 5px 30px rgba(0, 0, 0, 0.9);
        background: #F2AB34;
        border-radius: 15px 0px 0px 15px;
        z-index: 999;
    }

    .slideout-tab div {
        text-align: center;
        position: relative;
        right: 70px;
        top: 45%;
        /* background: #F2AB34; */
        transform: rotate(-90deg);
        -webkit-transform: rotate(-90deg);
        -moz-transform: rotate(-90deg);
        -o-transform: rotate(-90deg);
        /* width: 180px; */
        max-width: 50vh;
        min-width: 200px;
    }

    .vertical-text {
        writing-mode: lr-tb;
    }

    p, h1, h2, h3, h4, h5, h6 {
        color: black;
    }

    .slideout-content {
        position: fixed;
        width: 400px;
        max-height: 50vh;
        min-height: 200px;
        height: auto;
        top: 25vh;
        right: -400px;
        transition-property: all;
        transition-duration: 1s;
        transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
        z-index: 500;
        background-color: rgba(255, 255, 255, 0.9);
        padding: 5px;
        overflow-y: scroll;
    }

    .slideout-show {
        right: 0px !important;
    }

    :slotted(*) {
        color: black !important;
    }
</style>