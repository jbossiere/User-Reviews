$(document).ready(function() {
	Parse.initialize('4Erb7Ymb1EFlTkeJm8HyAteixPiOiE1BvHC35uKf',"viZvyOj4Z3s8AKNkRM2jgJpO1hao5hsLoRahxjkF");

	var Review = Parse.Object.extend('Review');

	$('form').submit(function() {
		var review = new Review();
		$(this).find('.form-control').each(function() {
			review.set($(this).attr('id'), $(this).val());
			// console.log($(this).attr('id'))
			// console.log($(this).val())
			$(this).val('');
		})
		review.save();
		return false;
	})

	// $('#star').raty();
})