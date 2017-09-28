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
}

function SRPT(){
	this.name = "SRPT";
	this.color = randomColor({luminosity: 'light'});
	this.queue = [];

	this.setQueue = function(processes){
		for(var i = 0; i < processes.length; i++){
			this.queue.push(new Process(processes[i], color=randomColor({luminosity: 'light'})));
		}
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
}

function drawResources(algorithms, processes){
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
		ctx.fillStyle = "black";
		ctx.fillText(algorithms[i].name, startX+(width/4), startY+(height/2) );

		if( algorithms[i].name == "RR" ){
			var tempQ = algorithms[i].queue;
			var k = 0;
			var count = [];
			var final = [];

			for(var j = 0; j < 20; j++){
				count[j] = 0;
			}

			while(tempQ.length > 0){
				for (let proc in tempQ){
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
			}
			for(var j = 0; j < count.length; j++){
				sum_cpu += (final[j]-(count[j]*4));
			}
			ctx.fillText("AWT: "+sum_cpu/20, queueX+(width/10), startY+(height/3) );
			ctx.fillText("End: "+queueTotal, queueX+(width/12), startY+(height*0.80) );
			startY+=height;
		} else if( algorithms[i].name == "SRPT" ){
			var processed = [];
			var waiting = [];
			var temp1 = algorithms[i].queue.slice();
			var countS = [];

			for(var a = 0; a < 20; a++){
				countS[a] = 0;
			}

			var group = _.groupBy(temp1, "arrival");
			var temp_sort = [];

			for(var a = 0; a < group[0].length; a++){
				waiting.push(new Process(processes[group[0][a].name-1], color=group[0][a].color));
			}

			waiting.sort(function(a, b){
				if(a.burst_time == b.burst_time){
					return a.name - b.name;
				} else{
					return a.burst_time - b.burst_time;
				}
			});

			processed.push(new Process(processes[waiting[0].name-1], color=waiting[0].color));
			waiting.shift();

			delete group[0];

			var current = processed[0];
			var counter = 0;

			ctx.fillStyle = current.color;
			ctx.fillRect(queueX+5, startY+5, width, height-20);
			ctx.fillStyle = "black";
			ctx.fillText("#"+current.name, queueX+(width/10), startY+(height/3) );
			ctx.fillText("WT: "+queueTotal, queueX+(width/12), startY+(height*0.80) );
			ctx.fillText("RT: "+current.burst_time, queueX+(width/10), startY+(height/6) );

			var b = 1;

			++queueTotal;
			--current.burst_time;

			for(let proc in group){
				temp_sort = group[proc].sort(function(a, b){
					if(a.burst_time == b.burst_time){
						return a.name - b.name;
					} else{
						return a.burst_time - b.burst_time;
					}
				});

				for(var j = 0; j < temp_sort.length; j++){
					waiting.push(new Process(processes[temp_sort[j].name-1], color=temp_sort[j].color));
				}

				waiting.sort(function(a, b){
					if(a.burst_time == b.burst_time){
						return a.name - b.name;
					} else{
						return a.burst_time - b.burst_time;
					}
				});

				if(current.burst_time < 1){
					ctx.fillStyle = current.color;
					ctx.fillRect(queueX+5, startY+5, width, height-20);
					ctx.fillStyle = "black";
					ctx.fillText("#"+current.name, queueX+(width/10), startY+(height/3) );
					ctx.fillText("WT: "+ (queueTotal-counter), queueX+(width/12), startY+(height*0.80) );
					ctx.fillText("RT: "+current.burst_time, queueX+(width/10), startY+(height/6) );
					queueX+=width;
					if(queueX > 2750){
						startY+=height;
						queueX = startX + width + 15;
					}
					processed.push(new Process(processes[waiting[0].name-1], waiting[0].color));
					processed[processed.length-1].burst_time = waiting[0].burst_time;
					current = processed[processed.length-1];
					counter = 0;
					waiting.shift();

				} else if(current.burst_time > waiting[0].burst_time){
					waiting.push(new Process(processes[current.name-1], color=current.color));
					waiting[waiting.length-1].burst_time = current.burst_time;

					if(b == 1){
						b = 2;
						queueX+=width;
						queueTotal--;
					} else {
						ctx.fillStyle = current.color;
						ctx.fillRect(queueX+5, startY+5, width, height-20);
						ctx.fillStyle = "black";
						ctx.fillText("#"+current.name, queueX+(width/10), startY+(height/3) );
						ctx.fillText("WT: "+(queueTotal-counter), queueX+(width/12), startY+(height*0.80) );
						ctx.fillText("RT: "+current.burst_time, queueX+(width/10), startY+(height/6) );
						queueX+=width;
					}
					
					if(queueX > 2750){
						startY+=height;
						queueX = startX + width + 15;
					}

					console.log(current);

					processed.push(new Process(processes[waiting[0].name-1], color=waiting[0].color));
					countS[current.name-1]++;
					current = processed[processed.length-1];
					counter = 0;

					console.log(current);

					waiting.shift();

				} else{
					++counter;
				}
				
				++queueTotal;
				--current.burst_time;
			}
			
			processed = processed.concat(waiting);
			queueTotal--;
			processed[processed.indexOf(current)].burst_time++;

			// console.log(waiting);

			for(var proc = processed.indexOf(current); proc < processed.length; proc++){
				// console.log(processed[proc]);
				ctx.fillStyle = processed[proc].color;
				ctx.fillRect(queueX+5, startY+5, width, height-20);
				ctx.fillStyle = "black";
				ctx.fillText("#"+processed[proc].name, queueX+(width/10), startY+(height/3) );
				ctx.fillText("WT: "+queueTotal, queueX+(width/12), startY+(height*0.80) );
				ctx.fillText("RT: 0", queueX+(width/10), startY+(height/6) );
				sum_cpu += (queueTotal-processed[proc].arrival-countS[processed[proc].name-1]);
				queueTotal+=(processed[proc].burst_time+counter);
				queueX+=width;
				if(queueX > 2750){
					startY+=height;
					queueX = startX + width + 15;
				}
				counter = 0;
			}

			console.log(sum_cpu);
			ctx.fillText("End: "+queueTotal, queueX+(width/12), startY+(height*0.80) );
			ctx.fillText("AWT: "+ (sum_cpu/algorithms[i].queue.length), queueX+(width/10), startY+(height/3) );
			startY+=height;

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

drawResources(algorithms, sample_process);
