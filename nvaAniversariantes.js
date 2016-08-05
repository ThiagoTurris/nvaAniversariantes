var nvaFx = window.nvaFx || {};

nvaFx.Aniversariantes = {
	init: function(){
		$('<img src="/User%20Photos/Profile%20Pictures/" style="width:0px;height:0px;"/>').appendTo('body');

		//var scriptbase = _spPageContextInfo.webAbsoluteUrl + '/_layouts/15/';
		var scriptbase = "https://portalnuova.sharepoint.com/sites/dev-intranet-messianica/" + '/_layouts/15/';
		$.getScript(scriptbase + 'SP.UserProfiles.js', function () {
			nvaFx.Aniversariantes.build();
		});

		SPBirthdays();

	},
	build: function(){
		nvaFx.Aniversariantes.getUsersBirthdays(
			function(usersProperties){
				_.each(usersProperties, function(user, index){
					console.log(user, index, usersProperties)
					// birthday = user.birthday;

					// if( !!birthday) {
					// 	birthday = birthday.get_value();
					// }

					// birthday = moment( birthday.split(' ')[0], "DD/MM/YYYY");

					// user.birthday = birthday;
					// // user.picture = location.host + '/_layouts/15/userphoto.aspx?size=L&accountname='+user.Title;
					// if( !!user.Picture ) {
					// 	user.picture = user.Picture.get_url();
					// }

					// if( birthday.isValid() ) {
						// console.log(  user.Title, birthday.format('DD-MM-YYYY') )
					// }

					// console.log( user );
				});
			},
			function(sender,args){
				console.error(args.get_message());
			}
			);
	},
	getUsersBirthdays: function(Success,Error) {
		// var ctx = new SP.ClientContext('https://portalnuova.sharepoint.com/sites/dev-intranet-messianica/');
		// var web = ctx.get_web();
		// var oGroups = web.get_siteGroups();

		// ctx.load(oGroups, 'Include(Title, Id, Users.Include(Title, LoginName))');

		// ctx.executeQueryAsync(
			// function() {
				// var peopleManager = new SP.UserProfiles.PeopleManager(ctx);
				// var persons = [];

				// oGroupsEnum = oGroups.getEnumerator()

				// while( oGroupsEnum.moveNext()){
					// oGroup = oGroupsEnum.get_current();
					// //console.log(oUser);
					// // var userProps = oUser.get_objectData().get_properties()


					// // console.log('get_objectData.get_properties:', userProps);

					// // var fullProps = peopleManager.getPropertiesFor(oUser.get_loginName());
	       		// // var personPicture = peopleManager.getUserProfilePropertyFor(oUser.get_loginName(),'Picture');

	       		// // userProps.birthday = personBirthday;
	       		// // userProps.picture = personPicture;

	       		// // persons.push(oUser);
	       	// }


	       	// // ctx.executeQueryAsync(
	       	// // 	function() {
	       	// // 		// Success(person);
	       	// // 	},
	       	// // 	Error);

	       // },
	       // Error);
	}

}

/*
	POST SEARCH QUERY
	http://www.lestersconyers.com/javascript-templating-with-sharepoint-2013-part-3/
	http://www.lestersconyers.com/birthdays-and-anniversaries/
*/
var SPBirthdays = function () {
    var settings = {
        localStoreTimeout: 30,
        daysForward: 365,
        wishPlaceholder: 'Say happy birthday...',
        templateId: 'birthdays-template',
        noDataMessage: 'Sorry. No birthdays upcoming.',
        maxDisplay: 4,
        srchProperty: 'RefinableDate01',
        cmprProperty: '',
        cmprMessage: 'years old'
    };

    var getDataFromSearch = function () {

        //var qryUrl = _spPageContextInfo.webAbsoluteUrl + "/_api/search/postquery";
		var qryUrl = "https://portalnuova.sharepoint.com/sites/dev-intranet-messianica/_vti_bin/ListData.svc/Perfil";
		

        //go get my data
        $.ajax({
            url: qryUrl,
            type: 'GET',
            //contentType: "application/json;odata=verbose",
            // headers: {
               // "Accept": "application/json;odata=verbose",
               // "X-RequestDigest": $("#__REQUESTDIGEST").val()
            // },
			crossDomain: true,
            dataType: 'json',
            success: function(data){
            	console.log('sucesso:', data)
            	results = data.d.results;
				for (var i = 0; i < results.length; i++) {
					if(!results[i].Ativo ||!results[i].ComAniv){
						results.splice(i,1);
					}
				}

            	var birthdays_template_source = $("#birthdays-template").html();
            	var birthdays_template = Handlebars.compile(birthdays_template_source);

            	var today_birthdays_template_source = $("#today-birthdays-template").html();
            	var today_birthdays_template = Handlebars.compile(today_birthdays_template_source);

            	var birthdays_html = birthdays_template(buildDataObject(results));
            	var today_birthdays_html = today_birthdays_template(buildDataObject(results));
            	$(".nva-lista-aniversariantes-proximos").html(birthdays_html);
            	$(".nva-lista-aniversariantes-hoje").html(today_birthdays_html);


            	sendWish();
            },
            error: function(err){
            	console.error('Error:', err)
            }
        });
    };

    var buildDataObject = function(results) {
        var data = {
            Birthdays : [],
            TodayBirthdays: []
        };
		
        //foreach row of results
        for (var i = 0; i < results.length; i++) {

			var person = results[i];
						
            //set the default image of the photo
			//Verificar a origem da foto.
			//A person tem um campo de url pra foto
            if (!photoUrl) photoUrl = _spPageContextInfo.webAbsoluteUrl + '/_layouts/15/images/person.gif';

			
			var dateAux = Date.parseLocale(person.Birthday, "dd/MM/yyyy");
			var date = dateAux ? dateAux : new Date( Date.now() ); //Definir que valor vai caso a data definida não seja válida
			var now = new Date( Date.now() );
			person.BirthdayIsToday = date ? (date.getMonth() == now.getMonth() && date.getDate() == now.getDate()) : false;
			
			
            // if(i < 6) {
            	// birthday = new Date( Date.now() );
            // }

            // var realDate = Date.UTC(birthday);
            	// realDate = (isNaN(realDate) && birthday !== null) ?  new Date(birthday) : new Date(realDate);
            // var now = Date.now();
            	// now = new Date(now);

            // //check to see if the user's birthday month and day match today's month and day
            // var birthdayToday = (realDate.getMonth() == now.getMonth() && realDate.getDate() == now.getDate());

            
			data.TodayBirthdays.push({
				Name: person.Título,
				Birthday: person.BirthdayIsToday ? 'Hoje!' : date.format("d MMMM"), //if today is their birthday, say Today! Otherwise, show their birthday
				// Path: path,
				// PhotoUrl: photoUrl,
				// AccountName: accountName,
				// BirthdayIsToday: birthdayToday,
				// Department:department,
				// Office: office
				
				// OBS.: [Campo a ser usado na página]: person.[Campo da lista],
			});
            


        }

        return data;
    };

    var sendWish = function () {
    	$(document).on('keypress', '.happy-birthday-wish', function(e){

    		if (e.keyCode == 13 && !e.shiftKey) {
    		    e.preventDefault();

    		    //disable the textarea
    		    $(this).prop('disabled', true);

    		    var url = _spPageContextInfo.webAbsoluteUrl + '/_api/social.feed/my/feed/post';
    		    //get the domain\user_name of the birthday person. this was added to the data-user attribute in the template
    		    var userName = $(this).attr('data-user');
    		    //get the birthday message
    		    var message = $(this).val();

    		    //construct a json object the represents our birthday wish
    		    var wish = {
    		        'restCreationData': {
    		            '__metadata': {
    		                'type': 'SP.Social.SocialRestPostCreationData'
    		            },
    		            'ID': null,
    		            'creationData': {
    		                '__metadata': {
    		                    'type': 'SP.Social.SocialPostCreationData'
    		                },
    		                'Attachment': null,
    		                'ContentItems': { //use ContentItems to mention the birthday person
    		                    'results': [
    		                        {
    		                            '__metadata': {
    		                                'type': 'SP.Social.SocialDataItem'
    		                            },
    		                            'AccountName': userName,
    		                            'ItemType': 0,
    		                            'Uri': null
    		                        }
    		                    ]
    		                },
    		                'ContentText': '@{0} ' + message,
    		                'UpdateStatusText': false
    		            }
    		        }
    		    };

    		    $.ajax({
    		        url: url,
    		        type: 'POST',
    		        contentType: "application/json;odata=verbose;",
    		        headers: {
    		            "Accept": "application/json;odata=verbose",
    		            "X-RequestDigest": $("#__REQUESTDIGEST").val()
    		        },
    		        data: JSON.stringify(wish),
    		        dataType: 'json',
    		        context: $(this), //pass in the textarea as the context so we can work with it on success or error
    		        success: function (data) {
    		            //get the birthday person's name from the textarea
    		            var name = $(this).attr('data-name');
    		            //let user know post succeded
    		            var html = "<span class=\"birthday-wish-result alert alert-success\">Sua mensagem para " + name + " foi enviada ðŸ˜Š.</span>";
    		            var p = $(this).parent();
    		            //remove the textarea
    		            $(this).val('').fadeOut(400);
    		            p.find('.fechar-textarea').hide();
    		            //append the success message
    		            p.append(html);

    		            setTimeout(function(){
    		            	$(".birthday-wish-result").fadeOut(400);
    		            }, 4000);
    		        },
    		        error: function (xhr, status, error) {
    		            //alert('dang');
    		        }
    		    });
    		}
    	});

    	$(document).on('click', '.fechar-textarea', function(){
    		var p = $(this).parent();

    		p.find('.happy-birthday-wish, .fechar-textarea').stop(true,true).fadeOut(400);
    	});

    	$(document).on('click', '.abrir-textarea', function(e){
    		e.preventDefault();
    		var p = $(this).parent();

    		p.find('.happy-birthday-wish, .fechar-textarea').stop(true,true).fadeIn(400);
    	});

    };

    getDataFromSearch();
};