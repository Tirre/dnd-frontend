<template>
    <Teleport to="body">
        <div v-show="visible" @click="emitClose" style="position: fixed; top: 0px; left: 0px; width: 100vw; height: 100vw; z-index: 99; background-color: rgba(0,0,0); opacity: 0.5"></div>
        <div class="modal" id="modal" ref="modal" v-show="visible">
            <div class="modal-header">
                <slot name="header">
                    <h5 v-if="title" class="text-center"> {{ title }} </h5>
                    <div class="pull-right">
                        <button class="btn btn-sm btn-danger" @click="emitClose"> X </button>
                    </div>
                </slot>
            </div>

            <div class="modal-body">
                <slot>
                    <slot name="content">
                        MODAL CONTENT
                    </slot>
                </slot>
            </div>

            <div class="modal-footer">
                <slot name="footer">
                    <p v-if="footerText" class="text-center"> {{ footerText }} </p>
                </slot>
            </div>
        </div>
    </Teleport>
</template>


<script>
    export default {
        setup(){
        },
        data(){
            return {
            }
        },
        emits: ['close'],
        props: {
            visible: {
                type: Boolean,
                required: false,
                default: function(){
                    return false;
                }
            },
            title: {
                type: String,
                required: false,
                default: function(){
                    return undefined;
                }
            },
            footerText: {
                type: String,
                required: false,
                default: function(){
                    return undefined;
                }
            },
            width: {
                type: String,
                required: false
            },
            height: {
                type: String,
                required: false
            }
        },
        created: function() {
        },
        mounted: function(){
            if (this.width){
                this.$refs['modal'].style.width = this.width;
            }
            if (this.height){
                this.$refs['modal'][0].style.height = this.height;
            }
        },
        unmounted: function(){

        },
        methods: {
            emitClose: function(){
                this.$emit("close", {});
            }
        }
    }
</script>

<style scoped>
    #modal {
        display: block;
        visibility: visible;
        /* background-color: black; */
        /* padding: 10px; */
        /* border-radius: 5%; */
    }

    .modal {
        position: fixed;
        z-index: 100;
        top: 15%;
        max-height: 70%;
        min-height: 30vh;
        left: 50%;
        width: 40vw;
        min-width: 300px;
        max-width: 80vw;
        height: auto;
        transform: translate(-50%, 0);
        overflow-y: scroll;
    }
</style>