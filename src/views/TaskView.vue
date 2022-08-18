<script setup>
import { ref, computed, onMounted } from 'vue';
import TaskService from '../services/TaskService';

let tasks = ref([])
let taskSelected = ref(0)
let insertScreen = ref(false)
let nameNewTask = ref("")
let alertMessage = ref("")

const getTask = async () => {
  try {
    const info = await TaskService.getAll();
    tasks.value = info.data.content
  } catch (e) {
    console.error(e)
  }
}

const insertTask = async () => {

  if (!nameNewTask.value) {
    alertMessage.value = "Necessário preencher o nome da atividade."
  } else {
    let task = {}
    task.name = nameNewTask.value
    task.date = new Date().toISOString().split('T')[0]
    task.finished = 0

    try {
      const response = await TaskService.save(task)
      response.status == 200 && getTask()
    } catch (e) {
      console.error(e)
    } 
  }
}

const deleteTask = async () => {
  if (!taskSelected.value) {
    alertMessage.value = "Necessário selecionar uma atividade."
  } else {
    try {
      const response = await TaskService.delete(taskSelected.value)
      response.status == 200 && getTask()
    }
    catch (e) {
      console.error(e);
    }
  }
}

const finishTask = async () => {
  if (!taskSelected.value) {
    alertMessage.value = "Necessário selecionar uma atividade."
  } else {
    try {
      const response = await TaskService.finish(taskSelected.value)
      response.status == 200 && getTask()
    } catch (e) {
      console.error(e)
    }
  }
}

const cleanTask = () => {
  taskSelected.value ? taskSelected.value = 0 : false;
}

const cleanAlertMessage = () => alertMessage.value = "";

const openInsertScreen = () => {
  insertScreen.value = !insertScreen.value
}

const selectTask = (id) => {
  taskSelected.value = id
}

const tasksWithColumns = computed(() => {
  return [
    {
      column: "Id",
      data: tasks.value.map(v => v.id)
    },
    {
      column: "Nome",
      data: tasks.value.map(v => v.name)
    },
    {
      column: "Data",
      data: tasks.value.map(v => v.date)
    },
    {
      column: "Finalizado",
      data: tasks.value.map(v => v.finished == 0 ? "Nâo" : "Sim")
    }
  ]
})

onMounted(() => {
  getTask()
})
</script>

<template>
  <div class="border-2 rounded-lg border-cyan-700 ">
    <button class="m-2 p-2 border-2 rounded-lg border-red-500 bg-red-300" v-if="alertMessage" @click="cleanAlertMessage">
      <span class="font-bold text-white text-red-500">{{ alertMessage }}</span>
      <span class="m-1 p-1 font-medium border-2 rounded-lg bg-white">Limpar</span>
    </button>
    <div class="flex">
      <div
        v-for="(column, i) of tasksWithColumns" :key="i"
      >
        <span class="p-2 text-xl font-bold">{{ column.column }}</span>
        <div
          class="p-2 text-lg font-light"
          v-for="(task, i) of column.data" :key="i"
        >
          <span v-if="column.column == 'Id'" :class="task == taskSelected ? 'border-2 border-violet-700' : ''">
            <input type="checkbox" name="" id="" v-model="taskSelected" @change="selectTask(task)">
          </span>
          {{ task }}
        </div>
      </div>
    </div>
    <button class="font-medium text-base bg-violet-400 text-white border-2 rounded-lg border-violet-500 p-2 m-2" @click="openInsertScreen">
      Inserir
    </button>
    <button class="font-medium text-base bg-violet-400 text-white border-2 rounded-lg border-violet-500 p-2 m-2" @click="deleteTask">
      Deletar
    </button>
    <button class="font-medium text-base bg-violet-400 text-white border-2 rounded-lg border-violet-500 p-2 m-2" @click="finishTask">
      Finalizar
    </button>
    <button class="font-medium text-base bg-violet-200 border-2 rounded-lg border-violet-500 p-2 m-2" @click="cleanTask">
      Limpar Seleção
    </button>
    <div v-if="insertScreen == true" class="m-2 p-2 border-2 rounded-lg border-cyan-500 flex">
      <span class="font-medium text-base m-2">Nome: </span>
      <input class="h-9 border-2 rounded-lg border-cyan-500" type="text" v-model="nameNewTask">
      <div>
        <button class="font-medium text-base bg-green-200  border-2 rounded-lg border-cyan-500 p-1 ml-2" @click="insertTask">
          Confirmar
        </button>
      </div>
    </div>
  </div>
</template>