import { HttpApiServices } from "./HttpApiServices";

export class MeetServices extends HttpApiServices {

    baseUrl = '/meet';

    async getMeets() {
        return await this.get(this.baseUrl);
    }
    
    async getMeetById(id:string) {
        return await this.get(this.baseUrl + '/' + id);
    }
    
    async getMeetObjects(id:string) {
        return await this.get(this.baseUrl + '/objects/' + id);
    }

    async updateMeet(body:any, id:string) {
        return await this.put(this.baseUrl + '/' + id, body);
    }

    async createMeet(body:any){
        return await this.post(this.baseUrl, body)
    }

    async deleteMeet(id:string) {
        return await this.delete(this.baseUrl + '/' + id);
    }
}