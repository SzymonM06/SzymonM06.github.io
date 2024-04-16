// Global variables
$catsMove = setInterval("catAnimation()", 400); // How much the cat moves
$catMargin = 20; // Starting value of how much the cat moves to the sides/possition
$catMarginTop = 0; // Starting height value of the cats/possition
$goingRight = true; // Starting value of to which side the cats move

// Function for cat animation
function catAnimation() {
    // Check if cats reached the bottom of the container
    if ($("#cats-container").height() + $catMarginTop >= 550) {
        clearInterval($catsMove); //turns off $catsmove
        gameOver(false); // you lost lol 
    }
    
    // Toggle between two cat images for animation effect
    var catsSrc = $(".cats").attr("src"); //img + css
	if (catsSrc == "Assets/cat.png") {
		$(".cats").attr("src", "Assets/cat2.png"); //replace cat.png with cat1.png
	} else {
		$(".cats").attr("src", "Assets/cat.png"); //vice versa
	}
    
    // Update cat's horizontal position and direction
    if ($catMargin == 20) {
        $goingRight = true; // Set direction to right
    }
    
    // Move cat horizontally based on direction
    if ($catMargin + $("#cats-container").width() < 580 && $goingRight == true) {
        $catMargin += 20;
    } else {
        $goingRight = false;
        $catMargin -= 20;
    }
    $("#cats-container").css("margin-left", $catMargin); // Apply the updated horizontal margin, aka move the cat left or right

    // Move cat down and update vertical margin
    if ($catMargin <= 20 || $catMargin + $("#cats-container").width() >= 580) {
        $catMarginTop += 20;
        $("#cats-container").css("marginTop", $catMarginTop);
    }
}

// Player control
$playerMargin = 280; // Starting possition for the player, this value will be reduced or increased by 10
$reload = true; // Starting value for player reload
$points = 0; // Player score, its called points in JS because score was taken in CSS, wont fix it, deal with it

// Event listener for player controls
$("body").keydown(function(event) { 
    $key = event.which;
    // Move player left if A key is pressed
    if ($key == 65 && $playerMargin > 20) { //bigger than 20 so it doesnt go trough a wall
        $playerMargin -= 10; //move by 10
        $("#player").css("margin-left", $playerMargin);  // set new margin for the player, aka move the player
    }
    // Move player right if D key is pressed
    if ($key == 68 && $playerMargin < 540) { //lower than 520 so it doesnt go trough a wall
        $playerMargin += 10;
        $("#player").css("margin-left", $playerMargin);
    }
    // Fire player bullet if reload is allowed and W key is pressed
    if ($reload == true && ($key == 87)) {
        $reload = false;
        // Set a timeout for player bullet reload
        $reloadTimeout = setTimeout(function() {  //cooldown basically
            $reload = true;
        }, 1500);
        // Create and position player bullet
        $("#player").after($("<img src='Assets/player-bullet.png' class='bullets' id='player-bullet'>")); //under player, place the bullet
        $player = $("#player"); 
        $playerPosition = $player.offset(); // get player location
        $("#player-bullet").offset({ left: $playerPosition.left + 15, top: $playerPosition.top }); //move bullet to right location
        $marginTopplayerBullet = 0;
        
        // Set interval for the player's bullet movement and collision detection
		$playerBulletInterval = setInterval(function() {
			// Update the position of the player's bullet
			$("#player-bullet").css("margin-top", $marginTopplayerBullet); // Set the margin-top property of the player's bullet
			$playerBulletPosition = $("#player-bullet").offset(); // get bullet location
			$marginTopplayerBullet -= 5; // Move the bullet upward

			// Get the position of the cats
			$catsLeft = $(".cats").offset(); // Store the offset of the cats

			// Check if the player's bullet has reached the top of the screen
			if ($playerBulletPosition.top <= 1) {
				clearInterval($playerBulletInterval); // Stop the interval
				$("#player-bullet").remove(); // Remove the bullet element
			}

			// Iterate over each cat on the screen
			$(".cats").each(function() {
				$catPosition = $(this).offset(); // Store the offset of the current cat
				$catLeft = $catPosition.left; // Store the left position of the current cat
				$catLeft += 10; // Adjust left position for collision check
				$catRight = $catPosition.left += $(".cats").width(); // Store the right position of the current cat and adjust left position
				$catRight += 20; // Adjust right position for collision check
				$catTop = $catPosition.top; // Store the top position of the current cat
				$catBottom = $catPosition.top += $(".cats").height(); // Store the bottom position of the current cat and adjust top position
				$playerTop = $playerBulletPosition.top; // Store the top position of the player's bullet
				$playerLeft = $playerBulletPosition.left; // Store the left position of the player's bullet
				$playerLeft += 20; // Adjust for the middle of the player

				// Check for collision between player bullet and current cat
				if ($playerTop >= $catTop && $playerTop <= $catBottom && $playerLeft >= $catLeft && $playerLeft <= $catRight) {
					clearInterval($playerBulletInterval); // Stop the interval
					$("#player-bullet").remove(); // Remove the bullet element
					$cat = $(this);

					// Remove the hit cat after a brief delay
					setTimeout(function() {
						$($cat).remove();
					}, 1);

					$points += 10; // Increase player's score
					$("#points").text($points);

					// Check for victory condition
					if ($points == 180) {
						gameOver(true); 
					}
				}
			});
		}, 10); //god, please help me
    }
});

// Set interval for cat bullets
$catBulletsFireInterval = setInterval("catBullets()", 2000);

// Function for cat bullets animation
function catBullets() {
    // Remove existing cat bullet if any
    if ($("#cat-bullet")) {
        $("#cat-bullet").remove();
    }
    // Create an array of cat elements
    $catsArray = [];
    $(".cats").each(function() {
        $catsArray.push(this);
    });
    // Choose a random cat and create a cat bullet
    $number = Math.floor(Math.random() * $catsArray.length);
    $("#cats-container").after($("<img src='Assets/cat-bullet.png' class='bullets' id='cat-bullet'>"));
    $cat = $($catsArray[$number]);
    $catPosition = $cat.offset();
    $("#cat-bullet").offset({ left: $catPosition.left + 15, top: $catPosition.top + 25 });
    $marginTop = 20;

    // Set interval for cat bullet animation
    $catBulletInterval = setInterval(function() {
        $("#cat-bullet").css("margin-top", $marginTop);
        $catBulletPosition = $("#cat-bullet").offset();
        $playerLeft = $("#player").offset();
        $playerRight = $playerLeft.left;
        $playerRight += 40;
        $marginTop += 5;

        // Check for collision between cat bullet and player
        if ($catBulletPosition.top >= 562 && $catBulletPosition.left >= $playerLeft.left && $catBulletPosition.left <= $playerRight) {
            gameOver(false); // End the game with a loss
            clearInterval($catBulletInterval);
        }
        // Remove cat bullet if it reaches the bottom
        if ($catBulletPosition.top >= 605) {
            clearInterval($catBulletInterval);
            $("#cat-bullet").remove();
        }
    }, 10);
}

// Game over function
function gameOver(win) {
    if (win == true) {
        $ending = "<a style=\"color:greenyellow;\">WON!</a>"; // Display win message in green
        $lost_gif = " "; // No loss animation if the player wins
    } else {
        $ending = "<a style=\"color:red;\">LOST!</a>"; // Display loss message in red
        $lost_gif = "<img src=\"Assets/dance.gif\" alt=\"Silly dance\" style=\"align-items: center; width:200px;\">"; // Show a dance animation for loss
        $("#player").remove(); // Remove player element on loss
    }
    clearInterval($catsMove);
    // Clear cat bullet interval if it exists
    if ($catBulletsFireInterval) {
        clearInterval($catBulletsFireInterval);
    }
    // Clear timeouts and intervals related to player bullets
    if (typeof $reloadTimeout !== 'undefined' && typeof $playerBulletInterval !== 'undefined') {
        clearInterval($reloadTimeout);
        clearInterval($playerBulletInterval);
    }
    $reload = false; // Disable player bullet reload
    // Display game ending details
    $("#ending").html($ending);
    $("#lost_gif").html($lost_gif);
    $("#end-screen").css("display", "block");
    $("body").keydown(function(event) {
        $key = event.which;
        // Reload the game on spacebar press
        if ($key == 32) {
            location.reload();
        }
    });
}
//blinking text
function blink_text() { 
    $('.blink').fadeOut(500);
    $('.blink').fadeIn(500);
}
setInterval(blink_text, 1000);
