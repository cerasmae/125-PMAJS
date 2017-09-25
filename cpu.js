var processes = [];
var algorithms = [];
var canvas;
var ctx;
var elmnt = document.body;
elmnt.scrollRight += 500;

canvas = document.getElementById("canvas");
ctx = canvas.getContext('2d');
canvas.width = window.innerWidth*2;
canvas.height = window.innerHeight*2;
ctx.font = "20px Tahoma";

function Process(array, color){
	this.name = array[0];
	this.arrival = array[1];
	this.burst_time = array[2];
	this.priority = array[3];
	this.color = color;

	this.processed = function(){
		this.burst_time--;
	}
}

function FCFS(){
	this.name = "FCFS";
	this.color = randomColor({luminosity: 'light'});
	this.queue = [];

	this.setQueue = function(processes){
		for(var i = 0; i < processes.length; i++){
			this.queue.push(new Process(processes[i], color=randomColor({luminosity: 'light'})));
		}
	}

	this.process = function(user){
		if(this.queue.length > 0){
			if(this.queue[0].burst_time <= 1){
				this.queue.shift();
			} else{
				this.queue[0].processed();
			}
		}
	}
}

function SJF(){
	this.name = "SJF";
	this.color = randomColor({luminosity: 'light'});
	this.queue = [];

	this.setQueue = function(processes){
		for(var i = 0; i < processes.length; i++){
			this.queue.push(new Process(processes[i], color=randomColor({luminosity: 'light'})));
		}
		this.queue.sort(function(a, b){
			return a.burst_time - b.burst_time;
		});
	}

	this.process = function(){
		if(this.queue.length > 0){
			if(this.queue[0].burst_time <= 1){
				this.queue.shift();
			} else{
				this.queue[0].processed();
			}
		}
	}
}

function SRPT(){
	this.name = "SRPT";
	this.color = randomColor({luminosity: 'light'});
	this.queue = [];

	this.setQueue = function(processes){
		var temp1 = [];
		var processed = [];
		var waiting = [];
		for(var i = 0; i < processes.length; i++){
			temp1.push(new Process(processes[i], color=randomColor({luminosity: 'light'})));
		}

		processed.push(new Process(processes[0], color=temp1[0].color));
		temp1.shift();

		var group = _.groupBy(temp1, "arrival");
		var temp_sort = [];

		var current = processed[0];
		var counter = current.burst_time;

		for(let proc in group){
			if(current.burst_time < 1){
				--current.burst_time;
				processed.push(new Process(processes[waiting[0].name-1], color=processes[waiting[0].name-1].color));
				current = processed[processed.length-1];
				waiting.shift();
			} else{
				--current.burst_time;
			}
			console.log(current.burst_time);
			
			temp_sort = group[proc].sort(function(a, b){
				if(a.burst_time == b.burst_time){
					return a.name - b.name;
				} else{
					return a.burst_time - b.burst_time;
				}
			});

			for(var i = 0; i < temp_sort.length; i++){
				if(current.burst_time > temp_sort[i].burst_time){
					waiting.push(new Process(processes[current.name-1], color=current.color));
					waiting[waiting.length-1].burst_time = current.burst_time;
					processed.push(new Process(processes[temp_sort[i].name-1], color=temp_sort[i].color));
					current = processed[processed.length-1];
				} else{
					waiting.push(new Process(processes[temp_sort[i].name-1], color=temp_sort[i].color));
					waiting.sort(function(a, b){
						if(a.burst_time == b.burst_time){
							return a.name - b.name;
						} else{
							return a.burst_time - b.burst_time;
						}
					})
				}
			}
			// console.log(temp_sort);
		}
		console.log("out");
		console.log(processed.concat(waiting));

		// for(var i = 1; i <= last; i++){
		// 	for(var j = 0; j < group.length; j++){
		// 		if(temp1[j].arrival <= i){
		// 			if(temp1[j].arrival == i){ //newly arrived process
		// 				if(temp1[j].burst_time < temp2[temp2.length-1].burst_time){

		// 				} else {

		// 				}
		// 				temp2 
		// 				temp1.slice(j, 1);
		// 			}
		// 		} else{
		// 			break;
		// 		}
		// 	}
		// }
	}
}

function Priority(){
	this.name = "Priority";
	this.color = randomColor({luminosity: 'light'});
	this.queue = [];

	this.setQueue = function(processes){
		for(var i = 0; i < processes.length; i++){
			this.queue.push(new Process(processes[i], color=randomColor({luminosity: 'light'})));
		}
		this.queue.sort(function(a, b){
			if(a.priority!=b.priority){
				return a.priority - b.priority;
			} else{
				return a.name - b.name;
			}	
		});
	}

	this.process = function(){
		if(this.queue.length > 0){
			if(this.queue[0].burst_time <= 1){
				this.queue.shift();
			} else{
				this.queue[0].processed();
			}
		}
	}
}

function RoundRobin(){
	this.name = "RR";
	this.color = randomColor({luminosity: 'light'});
	this.queue = [];
	this.final = [];
	this.counter = [];
	this.i = 0;
	this.quantum = 0;

	this.setQueue = function(processes){
		for(var i = 0; i < processes.length; i++){
			this.queue.push(new Process(processes[i], color=randomColor({luminosity: 'light'})));
		}
	}

	this.process = function(time){
		if(this.queue[0].burst_time <= 1){
			this.queue.shift();
		} else{
			if(this.quantum == 4){
				this.i++;
				this.quantum = 0;
			} else{
				this.quantum++;
				this.queue[0].processed();
			}
		}
	}
}

function drawResources(algorithms){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	var height = canvas.height/10;
	var width = 80;
	var startX = 15;
	var startY = 0;
	var queueX = startX;
	var queueTotal = 0;
	var sum_cpu = 0;

	for(var i = 0; i < algorithms.length; i++){
		ctx.fillStyle = algorithms[i].color;
		ctx.fillRect(startX, startY+5, width, height-20);
		queueX = startX + width + 15;
		sum_cpu = 0;
		queueTotal = 0;
		console.log(startY);
		ctx.fillStyle = "black";
		ctx.fillText(algorithms[i].name, startX+(width/4), startY+(height/2) );

		if( algorithms[i].name == "RR" ){
			var tempQ = algorithms[i].queue;
			var k = 0;
			var sum_rr = 0;
			var count = [];
			var final = [];

			for(var j = 0; j < 20; j++){
				count[j] = 0;
			}

			while(tempQ.length > 0){
				for (let proc in tempQ){
					// //console.log(algorithms[i].queue[proc].name);
					//console.log("proc: "+proc);
					if(algorithms[i].queue[proc] != null){
						ctx.fillStyle = algorithms[i].queue[proc].color;
						ctx.fillRect(queueX+5, startY+5, width, height-20);
						ctx.fillStyle = "black";
						ctx.fillText("#"+algorithms[i].queue[proc].name, queueX+(width/10), startY+(height/3) );
						ctx.fillText("WT: "+queueTotal, queueX+(width/12), startY+(height*0.80) );

						if(algorithms[i].queue[proc].burst_time <= 4){
							final[algorithms[i].queue[proc].name-1] = queueTotal;
							queueTotal += algorithms[i].queue[proc].burst_time;
							ctx.fillText("RT: 0", queueX+(width/10), startY+(height/6) );
							algorithms[i].queue[proc] = null;
						} else{
							queueTotal += 4;
							count[algorithms[i].queue[proc].name-1]++;
							algorithms[i].queue[proc].burst_time-=4;
							ctx.fillText("RT: "+algorithms[i].queue[proc].burst_time, queueX+(width/10), startY+(height/6) );
						}
						queueX+=width;
						if(queueX > 2750){
							startY+=height;
							queueX = startX + width + 15;
						}

					}
				}

				for(let proc in tempQ){
					if(algorithms[i].queue[proc] == null){
						algorithms[i].queue.splice(proc, 1);
					}
				}

				// //console.log(tempQ.length);
			}
			//console.log(count);
			//console.log(final);
			for(var j = 0; j < count.length; j++){
				sum_rr += (final[j]-(count[j]*4));
			}
			ctx.fillText("AWT: "+sum_rr/20, queueX+(width/10), startY+(height/3) );
			ctx.fillText("End: "+queueTotal, queueX+(width/12), startY+(height*0.80) );
			startY+=height;
			// //console.log(algorithms[i].queue);
		} else if( algorithms[i].name == "SRPT" ){
			// console.log("SRPT");
			// var temp1 = algorithms[i].queue.slice();
			// var temp2 = [];
		
			// var len = temp1.length-1;
			// var last = temp1[len].arrival;
			// ctx.fillStyle = temp1[0].color;
			// ctx.fillRect(queueX+5, startY+5, width, height-20);
			// ctx.fillStyle = "black";
			// ctx.fillText("#"+temp1[0].name, queueX+(width/10), startY+(height/3) );
			// ctx.fillText("WT: "+queueTotal, queueX+(width/12), startY+(height*0.80) );
			// ctx.fillText("RT: "+temp1[], queueX+(width/10), startY+(height/6) );
			// // temp2.push(new Process(processes[0], color=temp1[0].color));
			// // temp1.slice(0, 1);
			// for(var i = 0; i < last; i++){
			// 	for(var j = 0; j < temp1.length; j++){
			// 		if(temp1[j].arrival <= i){
			// 			if(temp1[j].arrival == i){ //newly arrived process
			// 				if(temp1[j].burst_time < temp2[j].burst_time){

			// 				}
			// 				ctx.fillStyle = temp1[j].color;
			// 				ctx.fillRect(queueX+5, startY+5, width, height-20);
			// 				ctx.fillStyle = "black";
			// 				ctx.fillText("#"+temp1[j].name, queueX+(width/10), startY+(height/3) );
			// 				ctx.fillText("WT: "+queueTotal, queueX+(width/12), startY+(height*0.80) );
			// 				ctx.fillText("RT: 0", queueX+(width/10), startY+(height/6) );
			// 				temp1.slice(j, 1);
			// 			}
			// 		} else{
			// 			break;
			// 		}
			// 	}
			// }
			startY+=height;
			// console.log(temp2);

		} else {
			for(var j = 0; j < algorithms[i].queue.length; j++){
				ctx.fillStyle = algorithms[i].queue[j].color;
				ctx.fillRect(queueX+5, startY+5, width, height-20);
				ctx.fillStyle = "black";
				ctx.fillText("#"+algorithms[i].queue[j].name, queueX+(width/10), startY+(height/4) );
				ctx.fillText("WT: "+queueTotal, queueX+(width/12), startY+(height*0.80) );
				queueTotal += algorithms[i].queue[j].burst_time;
				sum_cpu += queueTotal;
				queueX+=width;
			}
			sum_cpu -= queueTotal;
			ctx.fillText("AWT: "+(sum_cpu/algorithms[i].queue.length), queueX+(width/10), startY+(height/4) );
			ctx.fillText("End: "+queueTotal, queueX+(width/12), startY+(height*0.80) );
			startY+=height;
		}
	}


}

/////////////////////////////////////////////
var sample_process = JSON.parse(one);
// var sample_process = JSON.parse(two);

var fcfs = new FCFS();
fcfs.setQueue(sample_process);
algorithms.push(fcfs);

var sjf = new SJF();
sjf.setQueue(sample_process);
algorithms.push(sjf);

var srpt = new SRPT();
srpt.setQueue(sample_process);
algorithms.push(srpt);

var priority = new Priority();
priority.setQueue(sample_process);
algorithms.push(priority);

var roundrobin = new RoundRobin();
roundrobin.setQueue(sample_process);
algorithms.push(roundrobin);

drawResources(algorithms);
