$(document).ready(function() {
	Parse.initialize('4Erb7Ymb1EFlTkeJm8HyAteixPiOiE1BvHC35uKf',"viZvyOj4Z3s8AKNkRM2jgJpO1hao5hsLoRahxjkF");

	var Review = Parse.Object.extend('Review');

	// create the star rating for user review
	$('#reviewStar').raty({
		score: 4
	});

	// gets user input including individual ratings and saves to parse.com
	$('form').submit(function() {
		var review = new Review();
		$(this).find('#title, #body').each(function() {
			review.set($(this).attr('id'), $(this).val());
			$(this).val('');
		})
		// creates star review bar for user input
		var starNum = $('#reviewStar').raty('score');
		review.set($('#reviewStar').attr('id'), starNum);

		// // reloads the star string after submit
		// $('#reviewStar').raty('set', {number: 5});
		review.save(null, {
			success:getData
		})

		return false;
	})


	var getData = function() {
		var query = new Parse.Query(Review);
		query.exists('reviewStar');
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

		// Loop through your data, and pass each element to the addItem function
		data.forEach(function(d){
			addItem(d);
		})
		// averaging
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
		// Get parameters (website, band, song) from the data item passed to the function
		var title = item.get('title');
		var body = item.get('body');
		var stars = item.get('reviewStar');
		var date = item.get('createdAt');
		var trimDate = String(date).substring(0, 15);

		totalReviews++;
		totalRating += parseInt(stars);

		var div = $('<div id="reviewDiv"></div>');

		$('ul').append(div);

		$('div:last').raty({
			readOnly: true,
			score: stars
		})

		var button = $('<button id="deleteButton" class="btn-danger btn-xs"><span class="glyphicon glyphicon-remove"></span></button>')
		button.click(function() {
			item.destroy({
				success:getData
			})
		})
		div.append(button);


		var customerTitle = $('<h3></h3>');
		customerTitle.text(title);
		div.append(customerTitle);

		var customerReview = $('<p id="reviewBody"></p>');
		customerReview.text(body);
		div.append(customerReview);

		var reviewDate = $('<p></p>');
		reviewDate.text("posted on: " + trimDate);
		div.append(reviewDate);

		
		// Append li that includes text from the data item
		// var li = $('<li>Check out ' + body + ', their best song is ' + title + '</li>')
		
		// Create a button with a <span> element (using bootstrap class to show the X)
		
		// Click function on the button to destroy the item, then re-call getData

		// Append the button to the li, then the li to the ol
		// $('ol').append(li)
		
	}



	// Call your getData function when the page loads
	getData()

})


