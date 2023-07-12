<template>
    <template>
        <Teleport to="body">
            <div id="global-spinner" class="text-center" v-if="enabled">
                <div class="spinner-border" style="width: 5rem; height: 5rem;" role="status">
                    <span v-if="text && text.length > 0" class="sr-only"> {{  text }}</span>
                </div>
                <p> {{ text }} </p>
            </div>
        </Teleport>
    </template>
</template>

<script>
    export default {
        data(){
            return {
            }
        },
        props: {
            enabled: {
                type: Boolean,
                required: false,
                default: function(){
                    return false;
                }
            },
            text: {
                type: String,
                required: false,
                default: function(){
                    return "Loading ...";
                }
            }
        }
    }
</script>

<style scoped>
    #global-spinner {
        position: fixed;
        z-index: 200;
        top: 30%;
        left: 50%;
        width: auto;
        height: auto;
        background-color: rgba(0,0,0, 0.7);
        transform: translate(-50%, -50%);
        justify-content: center;

    }
</style>