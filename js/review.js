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
		$(this).find('#title, #body').each(function() {
			review.set($(this).attr('id'), $(this).val());
			$(this).val('');
		})
		// creates star review bar for user input
		var starNum = $('#reviewStar').raty('score');
		if (starNum == undefined) {
			review.set($('#reviewStar').attr('id'), 0);	
		}
		review.set($('#reviewStar').attr('id'), starNum);

		// reloads the star string after submit
		$('#reviewStar').raty('set', {number: 5});
		review.save(null, {
			success:getData
		})

		return false;
	})


	var getData = function() {
		console.log('save success')
		var averageStar = 0;
		var query = new Parse.Query(Review);
		query.notEqualTo('#reviewStar', '');
		query.find({
			success:function(results) {
				buildList(results)
			}
		});

	}

	// A function to build your list
	var buildList = function(data) {
		console.log('query.find success')
		// Empty out your ordered list
		$('ol').empty()

		// Loop through your data, and pass each element to the addItem function
		var denom = data.length;
		console.log(denom)
		// data.forEach(function(d){
		// 	addItem(d);
		// })
	}

	// This function takes in an item, adds it to the screen
	var addItem = function(item) {
		// Get parameters (website, band, song) from the data item passed to the function
		var website = item.get('website')
		var band = item.get('band')
		var song = item.get('song')
		
		// Append li that includes text from the data item
		var li = $('<li>Check out ' + band + ', their best song is ' + song + '</li>')
		
		// Create a button with a <span> element (using bootstrap class to show the X)
		var button = $('<button class="btn-danger btn-xs"><span class="glyphicon glyphicon-remove"></span></button>')
		
		// Click function on the button to destroy the item, then re-call getData
		button.click(function() {
			item.destroy({
				success:getData
			})
		})

		// Append the button to the li, then the li to the ol
		li.append(button);
		$('ol').append(li)
		
	}

	// Call your getData function when the page loads
	getData()

	// create a read-only star rating that shows average rating
	$('#averageStar').raty({
		readOnly: true,	
		score: 3
	})

})


