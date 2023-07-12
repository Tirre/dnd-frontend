<template>
    <q-table
        title="Mob Information"
        :rows="tableData"
        color="amber"
        :pagination="paginationOptions"
        :hide-pagination="true"
    >
        <template #header="props">
            <MobTableRowHeader />
        </template>
        <template #body="props">
            <MobTableRow :mobData="props.row" @selectMob="selectMob" @removeHP="removeHP" @restoreHP="restoreHP" @removeEntry="removeEntry"/>
        </template>
    </q-table>
</template>

<script>
    import MobTableRow from '@/components/MobTableRow.vue';
    import MobTableRowHeader from '@/components/MobTableRowHeader.vue';

    export default {
        data(){
            return {
                paginationOptions: {
                    page: 1,
                    rowsPerPage: 0,
                    sortBy: 'updated_at',
                    descending: false
                }
            }
        },
        components: {
            MobTableRow,
            MobTableRowHeader
        },
        emits: [ 'removeHP', 'restoreHP', 'removeEntry', 'selectMob' ],
        methods: {
            selectMob(monster){
                this.$emit('selectMob', monster);
            },
            removeHP(name, amount){
                this.$emit('removeHP', name, amount);
            },
            restoreHP(name, amount){
                this.$emit('restoreHP', name, amount);
            },
            removeEntry(name){
                console.log("calling removeEntry for", name);
                this.$emit('removeEntry', name);
            }
        },
        props: {
            tableData: {
                type: Array,
                required: false,
                default: function(){
                    return [
                        {'name': 'Name1', 'initiative': 10, 'hp': 10, 'ac': 15},
                        {'name': 'Name2', 'initiative': 12, 'hp': 6, 'ac': 12},
                        {'name': 'Name3', 'initiative': 17, 'hp': 12, 'ac': 18},
                    ]
                }
            }
        }
    }
</script>

