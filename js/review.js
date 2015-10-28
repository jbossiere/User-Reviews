$(document).ready(function() {
	Parse.initialize('4Erb7Ymb1EFlTkeJm8HyAteixPiOiE1BvHC35uKf',"viZvyOj4Z3s8AKNkRM2jgJpO1hao5hsLoRahxjkF");

	var Review = Parse.Object.extend('Review');
	var review;
	var query;

	// create the star rating for user review
	$('#reviewStar').raty({
		score: 4
	});

	// gets user input including individual ratings and saves to parse.com
	$('form').submit(function() {
		review = new Review();
		$(this).find('#title, #body').each(function() {
			review.set($(this).attr('id'), $(this).val());
			$(this).val('');
		})

		// creates star review bar for user input
		var starNum = $('#reviewStar').raty('score');
		review.set("upVote", 0);
		review.set("downVote", 0);

		review.set($('#reviewStar').attr('id'), starNum);

		review.save(null, {
			success:getData
		});

		// resets the review bar
		$('#reviewStar').raty({
			score: 4
		})

		return false;
	})


	var getData = function() {
		query = new Parse.Query(Review);
		query.exists('reviewStar');
		query.descending('createdAt');
		query.find({
		 	success:function(results) {
		 		buildList(results)
		 	},
		 	error: function(error) {
		 		console.log(error);
		 		console.log(error.message);
		 	}

		});

	}

	// initializing variables 
	var averageRating; 
	var totalRating; // total number of stars
	var totalReviews; // number of reviews

	// A function to build your list
	var buildList = function(data) {
		averageRating = 0;
		totalReviews = 0;
		totalRating = 0;

		// Empty out your ordered list
		$('ol').empty()

		data.forEach(function(d){
			addItem(d);
		})

		// averaging stars
		averageRating = totalRating/totalReviews;

		// creates the average rating stars
		$('#averageStar').raty({
			readOnly: true,	
			half: true,
			score: averageRating
		})
	}


	// This function takes in an item, adds it to the screen
	var addItem = function(item) {
		var title = item.get('title');
		var body = item.get('body');
		var stars = item.get('reviewStar');
		var date = item.get('createdAt');
		var trimDate = String(date).substring(0, 15);
		var upVote = item.get('upVote');
		var downVote = item.get('downVote');

		totalReviews++;
		totalRating += parseInt(stars);

		var div = $('<div id="reviewDiv"></div>');

		$('ol').append(div);

		// create star for individual reviews
		$('div:last').raty({
			readOnly: true,
			score: stars
		})

		// create and append a delete button
		var delButton = $('<button id="deleteButton" class="button btn btn-default btn-xs"><span class="glyphicon glyphicon-remove"></span></button>');
		delButton.click(function() {
			item.destroy({
				success:getData
			})
		})
		div.append(delButton);

		// create and append a thumb down button
		var downButton = $('<button id="downThumb" class="button fa fa-thumbs-o-down"></button>');
		downButton.click(function() {
			query.get(item.id, {
				success: function(review) {
					review.increment("downVote")
					review.save(null, {
						success:getData
					});
				}
			})
		})
		div.append(downButton);

		// create and append a thumb up button
		var upButton = $('<button id="upThumb" class="button fa fa-thumbs-o-up"></button>');
		upButton.click(function() {
			query.get(item.id, {
				success: function(review) {
					review.increment("upVote")
					review.save(null, {
						success:getData
					});
				}
			})
		})
		div.append(upButton);


		// create title portion of reviews
		var customerTitle = $('<h3 id="customerTitle"></h3>');
		customerTitle.text(title);
		div.append(customerTitle);

		// create body portion of reviews
		var customerReview = $('<p id="reviewBody"></p>');
		customerReview.text(body);
		div.append(customerReview);

		// create stat about how many found it useful
		var voteRatio = $('<p></p>');
		if (upVote == 0 && downVote == 0) {
			voteRatio.text("No one has voted on this yet!")
		} else {
			voteRatio.text(upVote + " out of " + (upVote + downVote) + " found this review helpful");
		}
		div.append(voteRatio);

		// create review create-dates
		var reviewDate = $('<p></p>');
		reviewDate.text("posted on: " + trimDate);
		div.append(reviewDate);
		
	}



	// Call your getData function when the page loads
	getData()

})


