import { Component, OnInit, } from '@angular/core';
import { TasksService } from 'src/app/services/tasks.service';
import { Task } from 'src/app/model/task';
import { Member } from 'src/app/model/member';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-addtask',
  templateUrl: './addtask.component.html',
  styleUrls: ['./addtask.component.css'] ,
  
})
export class AddtaskComponent implements OnInit {

  members: Array<Member> =[];
  whatDo: 'Task' | 'Member' = 'Task';
  editor: string = '';
  currentNumber: number = 534;
  newMemberColor:string = ''
  history: Array<string> = ['aa', 'bb']


  constructor(private tasksService: TasksService){
    this.tasksService.getMemberListObs().subscribe((members: Array<Member>) => this.members = members);
    this.tasksService.getHistoryListObs().subscribe((e)=> this.history = [...e].reverse());   
  }

  ngOnInit(): void {
    if(this.members.length > 0){
      this.editor = this.members[0].name;
      this.tasksService.activeMember = this.editor
    }
  }
  editorChange(){
    this.tasksService.activeMember = this.editor
  }

  changeOption(el:string){
    if(el === this.whatDo){return}

    if(this.whatDo === 'Task'){
      this.whatDo = 'Member'
    }else{
      this.whatDo = 'Task'
    }

    const butts = document.querySelectorAll('.opt-but');

    if(this.whatDo === 'Task'){
      butts[0].classList.add('but-active');
      butts[1].classList.remove('but-active');
    }else{
      butts[1].classList.add('but-active');
      butts[0].classList.remove('but-active');
      }
     
  }
  onSubmitTask(form: NgForm){
    
    const task: Task = ({
      id: this.currentNumber + 1,
      name: form.value.name,
      created: new Date(),
      isDone: false,
      member: form.value.for,
      assignedBy: this.editor,
      importance: form.value.urgent,
      deadline: form.value.deadline
      
    
    })
    this.currentNumber++
    this.tasksService.add(task);
  }
  onSubmitMember(form: NgForm){
    if(this.members.length === 6){
      return
    }
    const member: Member = ({
      name: form.value.name,
      class: form.value.class,
      color: this.newMemberColor,
    })
    this.tasksService.addMember(member)
  }
  colorPick(e:string, n: number){
    const colors =document.querySelectorAll('.color-button');
    for(let i = 0; i < 5; i++){
      colors[i].classList.remove('cb-border')
    }
    colors[n].classList.add('cb-border');
    this.newMemberColor = e;
  }
}

