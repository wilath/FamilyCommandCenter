import { Component, OnInit } from '@angular/core';
import { TasksService } from 'src/app/services/tasks.service';
import { Task } from 'src/app/model/task';
import { Member } from 'src/app/model/member';
import { Observable, Subject, tap, throwError } from 'rxjs';
import { NgForm } from '@angular/forms';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent {

  tasklist: Array<Task> = [];
  memberList: Array<Member> = [];
  showDones: Array<sortInfo> = [];
  pipeChangeDetection: number = 0;
  onEdit: number = 0;
  docWidth = window.innerWidth;
  isSmallScreen: boolean = false;
  onDeleteMember: string = '';


  constructor(
    private tasksService: TasksService,
    private breakpointObserver: BreakpointObserver)
    {
    this.tasksService.getTaskListObs().pipe(tap(()=>{this.activatePipe()})).subscribe((tasks: Array<Task>) => this.tasklist = tasks)
    this.tasksService.getMemberListObs().pipe(tap((mem)=>{this.createSorts(mem)})).subscribe((members: Array<Member>) => this.memberList = members);
    this.createSorts(this.memberList)

    this.breakpointObserver.observe(['(max-width: 1350px)']).subscribe(result => {
      this.isSmallScreen = result.matches;
     
    });
    }

  remove(task: Task) {
    this.tasksService.remove(task);
    this.tasksService.addTaskToHistory(task, 'delete');
    this.activatePipe()
  }
  done(task: Task) {
    this.tasksService.done(task);
    this.activatePipe()
  }
  edit(task: number ){
    if (this.onEdit === 0 ){
  
      
      this.onEdit = task
    } else {
    
      setTimeout(()=>{this.onEdit = 0 },0)
      
    }
  }
  cancel(task:Task){
         
      this.onEdit = 0            
  }
  unDone(task: Task){
      this.tasksService.undone(task);
      this.activatePipe()
  }
  onEditTask(task: NgForm){
    this.edit(task.value.id)
    this.tasksService.editTask(task, this.onEdit)
    
  }

  switchView(n:number, i:number){
      switch (n){
        case 0:
          this.showDones[i].show = !this.showDones[i].show
        break;
        case 1:
          this.showDones[i].sort = !this.showDones[i].sort 
        break;
        case 2:
          this.showDones[i].dir = !this.showDones[i].dir 
        break;
      }
  }
  activatePipe(){
      this.pipeChangeDetection = Math.random()
  }
  createSorts(mems: any){
      for(const mem of mems){
        this.showDones.push({show:false,sort:false,dir:false})
      }
    
  }
  drop(e:CdkDragDrop<any>){
  let taskId = e.item.data;
  let newOwner = e.container.data
  this.tasksService.dropTask(taskId, newOwner)
  }
  
  terminateMember(del: NgForm, active: string){
    let name = del.value.reasign

    this.tasksService.deleteMember(name, active)
    setTimeout(()=>{this.onDeleteMember = ''},50)
  }


}
interface sortInfo{
  show: boolean;
  sort: boolean;
  dir: boolean;
}