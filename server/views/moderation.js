var User = require('../models/User');
var Place = require('../models/Place');
var Group = require('../models/Group');
var _ = require('underscore');

module.exports = {

    listPending: function (request, reply) {

        if (request.session.moderator === true) {

            User.all(function(err, people) {
                var pendingPeople = _.where(people, { approved: false });
                
                Place.all(function(err, places) {
                    var pendingPlaces = _.where(places, { approved: false });

                    Group.all(function(err, groups) {
                        var pendingGroups = _.where(groups, { approved: false });

                        if(pendingPeople.length + pendingPlaces.length + pendingGroups.length === 0) {
                            reply.view('noPending', { 
                                user      : request.session.user, 
                                moderator : request.session.moderator, 
                                admin     : request.session.admin 
                            });
                        }
                        else {
                            reply.view('listPending', { 
                                people    : pendingPeople, 
                                places    : pendingPlaces,
                                groups    : pendingGroups, 
                                user      : request.session.user, 
                                userid    : request.session.userid,
                                moderator : request.session.moderator, 
                                admin     : request.session.admin 
                            });
                        }
                    });
                });
            });
        }
        else { reply().code(401).redirect('/'); }
    }, 

    approvePerson: function (request, reply) {
        if (request.session.moderator) {
            User.update(request.params.person, { approved: true }, function (person) {
                console.log('approved:', person.key);
                reply().code(200).redirect('/people');
            });
        }
        else { reply().code(401).redirect('/'); }
    },

    approvePlace: function (request, reply) {
        if (request.session.moderator) {
            Place.update(request.params.place, { approved: true }, function (place) {
                console.log('approved:', place.key);
                reply().code(200).redirect('/places');
            });
        }
        else { reply().code(401).redirect('/'); }
    },

    approveGroup: function (request, reply) {
        if (request.session.moderator) {
            Group.update(request.params.group, { approved: true }, function (group) {
                console.log('approved:', group.key);
                reply().code(200).redirect('/groups');
            });
        }
        else { reply().code(401).redirect('/'); }
    },

    adminPerson: function (request, reply) {
        if (request.session.admin) {
            User.update(request.params.person, { admin: true, moderator: true, approved: true }, function (person) {
                console.log('made admin:', person.key);
                reply().code(200).redirect('/people');
            });
        }
        else { reply().code(401).redirect('/'); }
    },

    moderatorPerson: function (request, reply) {
        if (request.session.admin) {
            User.update(request.params.person, { moderator: true, approved: true }, function (person) {
                console.log('made moderator:', person.key);
                reply().code(200).redirect('/people');
            });
        }
        else { reply().code(401).redirect('/'); }
    },

};