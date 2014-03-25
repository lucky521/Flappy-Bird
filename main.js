var game = new Phaser.Game(400, 500, Phaser.AUTO, 'game_div');

var main_state = { 

	preload: function()
	{
		this.game.stage.backgroundColor = '#71c5cf';

		this.game.load.image('bird', 'assets/bird.png');
		this.game.load.image('pipe', 'assets/pipe.png');
		this.game.load.image('background', 'assets/background.png');
		
	},
	
	create: function()
	{
		this.bg1 = this.game.add.sprite(0, 0, 'background');
		this.bg2 = this.game.add.sprite(398, 0, 'background');
		
		this.score = 0;
		var style = {font:"30px Arial", fill:"#ffffff"};
		this.label_score = this.game.add.text(20, 20, "0", style);
		
		var anlustyle = {font:"10px Arial", fill:"#ffffff"};
		this.anlu = this.game.add.text(330, 20, "Dear Anlu", anlustyle);
		
		//为小鸟增加sprite
		this.bird = game.add.sprite(100, 245, 'bird');
		//游戏引擎中的重力
		this.bird.body.gravity.y = 1000;
		
		//空格键监听，jump()作为回调函数
		var space_key = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		space_key.onDown.add(this.jump, this); 
		
		//暂停按钮
		var pause_key = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
		pause_key.onDown.add(this.pause, this);
		
		//关注事件
		this.game.onPause.add(this.monPause, this);
		this.game.onResume.add(this.monResume, this);
		
		//为水管批量添加sprite
		this.pipes = game.add.group();
		this.pipes.createMultiple(20, 'pipe');
		
		//为add_row_of_pipes函数设置循环调用
		this.timer = this.game.time.events.loop(1500, this.add_row_of_pipes, this);
		
		//this.timer2 = this.game.time.events.loop(200, this.fly, this);
		
	},
	
	update: function()
	{
		if(this.bird.inWorld == false)
			this.restart_game();
		
		//游戏引擎中的碰撞监测
		this.game.physics.overlap(this.bird, this.pipes, this.restart_game, null, this);
		
		//移动背景
		this.move_background(this.bg1);
		this.move_background(this.bg2);
		
	},
	
	jump: function()
	{
		//垂直位置给一个速度
		this.bird.body.velocity.y = -350;
	},
	
	fly: function()
	{
		this.bird.angle = 0;
		var animation = this.game.add.tween(this.bird);
		animation.to({angle:-20},100);
		animation.start();
	},
	
	move_background: function(bg)
	{
		if(bg.x < -398)
			bg.x = 398;	
		bg.x -= 2;
	},

	restart_game: function()
	{
		this.game.time.events.remove(this.timer);
		this.game.state.start('main');
	},
	
	
	pause: function()
	{
		if(this.game.paused === true)
			this.game.paused = false;
		else
			this.game.paused = true;
	},
	
	monPause: function()
	{
		var pstyle = {font:"40px Arial", fill:"#ffffff"};
		this.pausefont = this.game.add.text(140, 200, "Pause", pstyle);		
	},
	
	monResume: function()
	{

		this.game.world.remove(this.pausefont);	
	},

	add_one_pipe: function(x, y)
	{
		var pipe = this.pipes.getFirstDead();
		pipe.reset(x, y);
		pipe.body.velocity.x = -200;
		pipe.outOfBoundsKill = true;
		
		this.score += 1;
		this.label_score.content = this.score;
	},
	
	add_row_of_pipes: function()
	{
		var hole = Math.floor(Math.random()*5) + 1;
		//八个方框组成一个管子
		for(var i=0;i<8;i++)
			if(i != hole && i != hole + 1)
				this.add_one_pipe(400, i*60+10);
	}
};



game.state.add('main', main_state);

game.state.start('main');
