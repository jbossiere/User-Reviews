$(document).ready(function() {
	Parse.initialize('4Erb7Ymb1EFlTkeJm8HyAteixPiOiE1BvHC35uKf',"viZvyOj4Z3s8AKNkRM2jgJpO1hao5hsLoRahxjkF");

	var Review = Parse.Object.extend('Review');

	// create the star rating for user review
	$('#reviewStar').raty({
		half: true
	});

	// gets user input including individual ratings and saves to parse.com
	$('form').submit(function() {
		var review = new Review();
		$(this).find('#title, #body, reviewStar').each(function() {
			review.set($(this).attr('id'), $(this).val());
			console.log($(this).attr('id'))
			console.log($(this).val())
			$(this).val('');
		})

		var starNum = $('#reviewStar').raty('score');
		console.log(starNum);
		review.set($('#reviewStar').attr('id'), starNum);

		// reloads the star string after submit
		$('#reviewStar').raty('set', {number: 5});

		review.save(null, {
			success:getData
		});

		return false;
	})


	var getData = function() {
		var averageStar = 0;
		var query = new Parse.Query(Review);
		query.notEqualTo('#reviewStar', '');
		// query.find({
		// 	success:function(results) {
		// 		averageData(results)
		// 	}
		// });
	}

	var averageData = function(data) {

	}

	// create a read-only star rating that shows average rating
	$('#averageStar').raty({
		readOnly: true,	
		score: 3
	})

})


