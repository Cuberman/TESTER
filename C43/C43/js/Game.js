class Game {
  constructor() {
    this.resetButton = createButton("")
    this.resetTitle = createElement("h2")
    this.leaderBoardTitle = createElement("h2")
    this.leader1 = createElement("h2")
    this.leader2 = createElement("h2")
  }
  //BP
  getState() {
    var gameStateRef = database.ref("gameState");
    gameStateRef.on("value", function(data) {
      gameState = data.val();
    });
  }
  //BP
  update(state) {
    database.ref("/").update({
      gameState: state
    });
  }

  // SA
  start() {
    player = new Player();
    playerCount = player.getCount();

    form = new Form();
    form.display();

    car1 = createSprite(width / 2 - 100, height - 100);
    car1.addImage("car1", car1_img);
    car1.scale = 0.07;

    car2 = createSprite(width / 2 + 100, height - 100);
    car2.addImage("car2", car2_img);
    car2.scale = 0.07;

    cars = [car1, car2];
    fuels = new Group()
    coins = new Group()
    cubes = new Group()

    this.addSprites(fuels,5,fuelImg,.02)
    this.addSprites(coins,21,coinImg,.09)
    this.addSprites(cubes,2,cubeImg,.05)
  }

  //BP
  handleElements() {
    form.hide();
    form.titleImg.position(40, 50);
    form.titleImg.class("gameTitleAfterEffect");
    this.resetTitle.html("Click to reset")
    this.resetTitle.class("resetText")
    this.resetTitle.position(width/2+(100+100),(14+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1))
    this.resetButton.class("resetButton")
    this.resetButton.position(width/2+(500-270),(1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1))
    this.leaderBoardTitle.html("LeaderBoard")
    this.leaderBoardTitle.class("resetText")
    this.leaderBoardTitle.position(width/3-60,1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1)
    this.leader1.class("leadersText")
    this.leader1.position(width/3-50,130)
    this.leader2.class("leadersText")
    this.leader2.position(width/3-50,180)
    
  }

  //SA
  play() {
    this.handleElements();
    this.handleResetButton()
    

    Player.getPlayersInfo(); //added
    player.getCarsAtEnd()
    

    if (allPlayers !== undefined) {
      image(track, 0, -height * 5, width, height * 6);
      this.showLeaderBoard()

      //index of the array
      var index = 0;
      for (var plr in allPlayers) {
        //use data form the database to display the cars in x and y direction
        var x = allPlayers[plr].positionX;
        var y = height - allPlayers[plr].positionY;

        cars[index].position.x = x;
        cars[index].position.y = y;

        //add 1 to the index for every loop
        index = index + 1;
        if(index === player.index){
          fill("#FF5F1F")
          stroke("#FF5F1F")
          ellipse(x,y,69,69)
          this.handleFuel(index)
          this.handleCoin(index)
          this.handleCubes(index)
         
          camera.position.x =  cars[index-1].position.x
          camera.position.y =  cars[index-1].position.y
           
        }
      }

      if (keyIsDown(UP_ARROW)) {
        player.positionY += 10;
        player.update();
      }
      this.handlePlayerControls()
      const finishLine = height*6-100
      if(player.positionY > finishLine){
        gameState = 2
        player.rank += 1
        Player.updateCarsAtEnd(player.rank)
        player.update()
        this.showRank()
      }
      drawSprites();
    }
  }

      addSprites(SG,numberOfSprites,spriteImg,scale){
        for(var i = 0; i < numberOfSprites; i++){
          var x,y
          x = random(width/2 +150,width/2 - 150)
          y = random(-height*4.5,height - 400)
          var sprite = createSprite(x,y)
          sprite.scale = scale
          sprite.addImage(spriteImg)
          SG.add(sprite)
        }
      }



         handleFuel(index){
          cars[index-1].overlap(fuels, function(collector,collected){
            player.fuel = 185
            collected.remove()
          })
         }
       
        handleCoin(index){
          cars[index-1].overlap(coins, function (collector,collected){
          player.score += 21
          player.update()
          collected.remove()
          })}
          
          handleCubes(index){
            cars[index-1].overlap(cubes, function (collector,collected){
            player.score += 190
            collected.remove()
            })}
            
        
        handleResetButton(){
        this.resetButton.mousePressed(()=>{
          database.ref("/").set({
/*JSON*/  playerCount:0,gameState:0,players:{},carsAtEnd:0
          
          })
          window.location.reload()
          
        })
      }
    handlePlayerControls(){
      if(keyIsDown(90)){
        player.positionX-=5
        player.update()
      }
      if(keyIsDown(84)){
        player.positionY+=10
        player.update()
      }
      if(keyIsDown(77)){
        player.positionX+=5
        player.update()
      }    
    }
    showLeaderBoard(){
      var leader1, leader2
      var players = Object.values(allPlayers)
      console.log(players)
      if((players[0].rank === 0 && players[1].rank === 0)|| players[0].rank === 1){
       leader1 = players[0].rank + "&emsp;" + players[0].name + "&emsp;" + players[0].score
       leader2 = players[1].rank + "&emsp;" + players[1].name + "&emsp;" + players[1].score
       console.log(leader1)
      
      }

      if(players[1].rank === 1){
        leader2 = players[0].rank + "&emsp;" + players[0].name + "&emsp;" + players[0].score
        leader1 = players[1].rank + "&emsp;" + players[1].name + "&emsp;" + players[1].score
        console.log(leader1)
      }

      this.leader1.html(leader1)
      this.leader2.html(leader2)
    
    console.log(leader1)
    
    }
    
      showRank(){
      swal({
      title: `ARYAN ${"\n"}rank ${"\n"} ${player.rank}`,
      text: "FOLTYN FAMILY ON TOP!!!",
      imageUrl:"https://www.google.com/imgres?imgurl=https%3A%2F%2Fyt3.ggpht.com%2FioxNBGNOfocatPfFQ6vn4LrU6zaPVpq4Ia6Sih_e2BOYj8kKQyc5NMzi_1NLWxt2GKR2JPDDaA%3Ds900-c-k-c0x00ffffff-no-rj&imgrefurl=https%3A%2F%2Fwww.youtube.com%2Fchannel%2FUCRkuUgtDAL4XSU5jB40J_wA&tbnid=0Vt4bbtGVJVH5M&vet=12ahUKEwjp_-mp4az5AhUZi9gFHeqzCVIQMygAegUIARC9AQ..i&docid=NiDHrPyx8if-GM&w=900&h=900&q=foltyn&ved=2ahUKEwjp_-mp4az5AhUZi9gFHeqzCVIQMygAegUIARC9AQ",
      imageSize: "100x100",
      confirmButtonText:"PLEASE CLICK FORBIDDEN BUTTON"
    
    
    })
     }
    
    

    }