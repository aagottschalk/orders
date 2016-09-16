var plugin = function(options) {
	var seneca = this;
	
	var helper = require('sendgrid').mail;

	seneca.add({area: "email", action: "send"}, function(args, done) {
		from_email = new helper.Email("alex@gottschalk.com.br");
		to_email = new helper.Email(args.to);
		subject = args.subject;
		content = new helper.Content("text/html", args.body);
		mail = new helper.Mail(from_email, subject, to_email, content);

		var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);

		var request = sg.emptyRequest({
		  method: 'POST',
		  path: '/v3/mail/send',
		  body: mail.toJSON()
		});

		sg.API(request, function(error, response) {
			if(error){
				done({code: response.statusCode}, null);
			}
			done(null, {status: "sent", code: response.statusCode, header: response.headers});
			//console.log(response.statusCode);
			//console.log(response.body);
			//console.log(response.headers);
		});
	});
}
module.exports = plugin;

var seneca = require('seneca')();
seneca.use(plugin);

seneca.listen({port: 5000});