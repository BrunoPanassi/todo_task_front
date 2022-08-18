import AxiosService from "./AxiosService";

class TaskService {
    getAll() {
        return AxiosService.get(`/task`);
    }
    get(id) {
        return AxiosService.get(`/task/${id}`);
    }
    save(task) {
        return AxiosService.post(`/task`, task);
    }
    put(id, task) {
        return AxiosService.put(`/task/${id}`, task);
    }
    delete(id) {
        return AxiosService.delete(`/task/${id}`);
    }
    finish(id) {
        return AxiosService.post(`/task/finish/${id}`);
    }
 }
export default new TaskService();