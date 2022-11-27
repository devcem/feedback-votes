var app = new Vue({
    el : '#wrapper',
    data : {
        form : {
            title : '',
            description : ''
        },
        alert : '',
        suggestions : []
    },
    methods : {
        init : function(){
            this.fetchSuggestions();
        },
        fetchSuggestions : function(){
            var self = this;

            window.fetch('https://api.tribals.io/?request=suggestions')
            .then(function(response){
                return response.json();
            })
            .then(function(data){
                self.suggestions = data.suggestions;
            });
        },
        voteSuggestion : function(suggestion){
            if(suggestion.alreadyVoted){
                alert('You already voted this suggestion!');
                return false;
            }

            suggestion.votes++;
            suggestion.alreadyVoted = true;

            window.fetch('https://api.tribals.io/?request=upvote_suggestion', {
                method : 'POST',
                body : JSON.stringify({
                    id : suggestion.id
                })
            })
            .then(function(response){
                return response.json();
            })
            .then(function(data){
                if(data.success){
                    alert('Thanks for your vote!');
                }
            });
        },
        sendSuggestion : function(){
            this.clearAlert();

            if(!this.form.title){
                this.showAlert('Please enter a title');
                return false;
            }

            if(!this.form.description){
                this.showAlert('Please enter a description');
                return false;
            }

            var self = this;

            window.fetch('https://api.tribals.io/?request=submit_suggestion', {
                method : 'POST',
                body : JSON.stringify(this.form)
            })
            .then(function(response){
                return response.json();
            })
            .then(function(data){
                if(data.success){
                    app.form.title = '';
                    app.form.description = '';
                }

                self.showAlert(data.message);
            });
        },
        clearAlert : function(){
            this.alert = '';
        },
        showAlert : function(message){
            this.alert = message;

            clearTimeout(this.alertTimer);
            this.alertTimer = setTimeout(function(self){
                self.alert = '';
            }, 5000);
        }
    }
});

app.init();