$(document).ready(function(){

		var audio = document.createElement('audio');
  		var source = document.createElement('source');
  		source.src = '/assets/music/Endgame.mp3';
  		audio.appendChild(source);
		audio.play();
		audio.volume = 0.3;

		$('.play').on("click", function(){

			window.location.replace("game.html");

		});

		$('.menu').on("click", function(){

			window.location.replace("/");

		});

});