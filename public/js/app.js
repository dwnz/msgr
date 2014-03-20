function ChatApp() {
	var self = this;

	self.socket = null;
	self.ctx = new(window.audioContext || window.webkitAudioContext);

	self.start = function() {
		if(window.localStorage.getItem("nn") === null){
			$('#welcomepopup').modal().on('shown.bs.modal', function(){
				$('#Nickname').focus().on('keypress', function(data, e){
					if(data.keyCode === 13){
						self.setupNickname();
					}
				});
			});            
		}

		self.socket = io.connect(document.domain);
		
		self.socket.on('news', function(data) {
			console.log(data);
			self.socket.emit('my other event', { my: 'data' });
		});

		self.socket.on('chat', function(data) {
			if(data.user === window.localStorage.getItem("nn")){
				$('#list').append('<div class="row"><div class="bubble col-md-4 col-md-offset-8 col-sm-10 alert-success">' + data.msg + '</div></div>');
			} else {
				$('#list').append('<div class="row"><div class="bubble col-md-4 col-sm-10 alert-info">' + data.msg + '</div></div>');
			}

			var x = 0;  //horizontal coord
			var y = $(document).height(); //vertical coord
			window.scroll(x,y);
		});

		$('#Message').on('keypress', function(data){
			if(data.keyCode === 13)
			{
				self.sendMessage();
			}
		});
	};

	self.setupNickname = function(){
		window.localStorage.setItem('nn', $('#Nickname').val());
		$('#welcomepopup').modal('close');
	};

	self.sendMessage = function() {
		self.socket.emit('chat', {
			user: window.localStorage.getItem("nn"),
			msg: $('#Message').val()
		});

		$('#Message').val('').focusout();

	};

	self.beep = function (duration, type, finishedCallback) {
		
	    
		duration = +duration;

		// Only 0-4 are valid types.
		type = (type % 5) || 0;

		if (typeof finishedCallback != "function") {
		finishedCallback = function () {};
		}

		var osc = self.ctx.createOscillator();

		osc.type = type;

		osc.connect(self.ctx.destination);
		osc.noteOn(0);

		setTimeout(function () {
		osc.noteOff(0);
		finishedCallback();
		}, duration);


	};

}

var app;
$(function() {
	app = new ChatApp();
	app.start();
})