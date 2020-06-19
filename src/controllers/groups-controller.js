const groupsRepository = require('../repositories/groups-repository');
const tokenRepository = require('../repositories/token-repository');
const environmentRepository = require('../repositories/environment-repository');
const categoriesRepository = require('../repositories/categories-repository');
const usersRepository = require('../repositories/users-repository');


exports.listGroups = async (req, res) => {
  var data = await environmentRepository.show(null,null);
  if(!data[0].hasGroups) return res.status(500).send({message: "Your environment do not alow groups"});

  const token = req.headers.authorization;
  const verify = await tokenRepository.verify(token);

  try {
    if(verify.role === 'admin') {
      data = await groupsRepository.list(null,'name description participants categories');
      return res.status(200).send(data);
    } else {
      data = await groupsRepository.list({type: 'public'},'name description participants categories');
      return res.status(200).send(data);
    }
  } catch (e) {
    return res.status(500).send({message: 'error on list all groups'});
  }


};

exports.GroupDetails = async (req, res) => {
  var data = await environmentRepository.show(null,null);
  if(!data[0].hasGroups) return res.status(500).send({message: "Your environment do not alow groups"});

  const token = req.headers.authorization;
  const verify = await tokenRepository.verify(token);

  try {
    if(verify.role === 'admin') {
      data = await groupsRepository.list({_id: req.params.id},null);
      return res.status(200).send(data[0]);
    } else {
      data = await groupsRepository.list({_id: req.params.id}, null);
      var foundUser = false;
      var promises = data[0].participants.map(async (participant) => {
        if(participant.userId === verify.id) foundUser = true;
      });
      await Promise.all(promises);
      if(foundUser) {
        return res.status(200).send(data[0]);
      } else {
        return res.status(500).send({message: 'You need to be a participant to see the details of this group'});
      }
    }
  } catch(e) {
      return res.status(500).send({message: 'Failed on get group details'});
  }

};

exports.createGroup = async (req, res) => {
  var error = false;
  var data = await environmentRepository.show(null,null);
  if(!data[0].hasGroups) return res.status(500).send({message: "Your environment do not alow groups"});

  const token = req.headers.authorization;
  const verify = await tokenRepository.verify(token);

  if(verify.role === 'user' && !data[0].canUsersMakeGroups) return res.status(403).send({message: 'You cant create the group'});

  if(req.body.type !== 'public' && req.body.type !== 'private') return res.status(500).send({message: 'Group type invalid'});

  if(req.body.participants.length === 0) {
    req.body.participants.push({role: 'leader', userId: verify.id});
  } else {
    var creatorAlreadyIn = false;
    var promises = req.body.participants.map(async (participant) => {
      try {
        var userExists = await usersRepository.list({_id: participant.id}, null);
      } catch (e) {
        error = true;
        return res.status(500).send({message: 'You are trying to send and invalid user has a participant'});
      }


      if(userExists.length === 0) {
        error = true;
        return res.status(500).send({message: 'You are trying to send and invalid user has a participant'});
      }
      if(userExists[0].id === verify.id) {
        error = true;
        creatorAlreadyIn = true;
        return res.status(500).send({message: 'Dont pass you user as a participant. You will be insert automatically'});
      }
    });
    await Promise.all(promises);
    if(!creatorAlreadyIn) req.body.participants.push({role: 'leader', userId: verify.id});
  }

  if(!data[0].hasCategories) {
    req.body.categories = null;
  } else {
    if(req.body.categories.length > 0) {
       promises = req.body.categories.map(async (category) => {
        var categoryExists = await categoriesRepository.list({name: category}, null);
        if(categoryExists.length === 0) {
          error = true;
          return res.status(500).send({message: 'You are trying to send an invalid category.'});
        }
      });
      await Promise.all(promises);
    }
  }

  if(!error) {
    try {
      await groupsRepository.create({
        name: req.body.name,
        description: req.body.description,
        categories: req.body.categories,
        participants: req.body.participants,
        type: req.body.type
      });
      return res.status(201).send({message: 'Group created.'});
    } catch (e) {
      return res.status(500).send({message: 'Failed on create group'});
    }
  }

};

exports.updateGroup = async (req, res) => {
  var error = false;
  var data = await environmentRepository.show(null,null);
  if(!data[0].hasGroups) return res.status(500).send({message: "Your environment do not alow groups"});

  const token = req.headers.authorization;
  const verify = await tokenRepository.verify(token);

  if(req.body.type !== 'public' && req.body.type !== 'private') return res.status(500).send({message: 'Group type invalid'});

  if(!data[0].hasCategories) {
    req.body.categories = null;
  } else {
    if(req.body.categories.length > 0) {
       promises = req.body.categories.map(async (category) => {
        var categoryExists = await categoriesRepository.list({name: category}, null);
        if(categoryExists.length === 0) {
          error = true;
          return res.status(500).send({message: 'You are trying to send an invalid category.'});
        }
      });
      await Promise.all(promises);
    }
  }

  if(!error) {
    try {
      if(verify.role === 'admin') {
        await groupsRepository.update(req.params.id,req.body);
        return res.status(200).send({message: 'Group updated'});
      } else {
        data = await groupsRepository.list({_id: req.params.id}, null);
        var foundUser = false;
        var promises = data[0].participants.map(async (participant) => {
          if(participant.userId === verify.id) {
            if(participant.role === 'leader') {
              foundUser = true;
            }
          }
        });
        await Promise.all(promises);
        if(foundUser) {
          await groupsRepository.update(req.params.id,req.body);
          return res.status(200).send({message: 'Group updated'});
        } else {
          return res.status(500).send({message: 'You need to be a leader to upgrade the group'});
        }
      }
    } catch(e) {
        return res.status(500).send({message: 'Failed on upgrade group'});
    }
  }
};

exports.deleteGroup = async (req, res) => {
  var data = await environmentRepository.show(null,null);
  if(!data[0].hasGroups) return res.status(500).send({message: "Your environment do not alow groups"});

  const token = req.headers.authorization;
  const verify = await tokenRepository.verify(token);

  try {
    if(verify.role === 'admin') {
      await groupsRepository.delete(req.params.id);
      return res.status(200).send({message: 'Group deleted'});
    } else {
      data = await groupsRepository.list({_id: req.params.id}, null);
      var foundUser = false;
      var promises = data[0].participants.map(async (participant) => {
        if(participant.userId === verify.id) {
          if(participant.role === 'leader') {
            foundUser = true;
          }
        }
      });
      await Promise.all(promises);
      if(foundUser) {
        await groupsRepository.delete(req.params.id);
        return res.status(200).send({message: 'Group deleted'});
      } else {
        return res.status(500).send({message: 'You need to be a leader to delete the group'});
      }
    }
  } catch(e) {
      return res.status(500).send({message: 'Failed on delete group'});
  }

};

exports.findByUser = async (req, res) => {
  var data = await environmentRepository.show(null,null);
  if(!data[0].hasGroups) return res.status(500).send({message: "Your environment do not alow groups"});

  const token = req.headers.authorization;
  const verify = await tokenRepository.verify(token);

  try {
      var groups = []
      data = await groupsRepository.list(null, 'name description participants categories');
      var promises = data.map(async (group) => {

        var id = group.participants.find(participant => {
          return participant.userId === verify.id
        });
        if(id !== undefined) groups.push(group);
      });
      await Promise.all(promises);
      return res.status(200).send(groups);

  } catch(e) {
      return res.status(500).send({message: 'Failed on delete group'});
  }

};

exports.AddUserToGroup = async (req, res) => {
  var data = await environmentRepository.show(null,null);
  if(!data[0].hasGroups) return res.status(500).send({message: "Your environment do not alow groups"});

  const token = req.headers.authorization;
  const verify = await tokenRepository.verify(token);

  try {
    data = await groupsRepository.list({_id: req.body.groupId}, null);

    if(data.length === 0) return res.status(500).send({message: "Group not found"});

    var self = data[0].participants.find(participant => {
      return participant.userId === verify.id
    });

    var participant = data[0].participants.find(participant => {
      return participant.userId === req.body.userId
    });

    if(verify.role === 'admin' || (self !== undefined && self.role === 'leader') ) {
      if(participant === undefined) {
        data[0].participants.push({role: "participant", userId: req.body.userId});
        await groupsRepository.update(req.body.groupId,data[0]);
        return res.status(201).send({message: "user added to the group"});
      } else {
        return res.status(500).send({message: "user already is a participant"});
      }
    } else if(self === undefined) {
      if(req.body.userId !== verify.id) {
        return res.status(500).send({message: "You dont have permission to add someone else"});
      } else {
        data[0].participants.push({role: "participant", userId: verify.id});
        await groupsRepository.update(req.body.groupId,data[0]);
        return res.status(201).send({message: "user added to the group"});
      }
    } else {
      return res.status(500).send({message: "failed on add user to the group"});
    }
  } catch(e) {
    return res.status(500).send({message: "failed on add user to the group"});
  }

};

exports.removeUserFromGroup = async (req, res) => {

  var data = await environmentRepository.show(null,null);
  if(!data[0].hasGroups) return res.status(500).send({message: "Your environment do not alow groups"});

  const token = req.headers.authorization;
  const verify = await tokenRepository.verify(token);

  try {
    data = await groupsRepository.list({_id: req.body.groupId}, null);

    if(data.length === 0) return res.status(500).send({message: "Group not found"});

    var self = data[0].participants.find(participant => {
      return participant.userId === verify.id
    });

    var participant = data[0].participants.find(participant => {
      return participant.userId === req.body.userId
    });

    if(verify.role === 'admin' || (self !== undefined && self.role === 'leader') ) {
      if(participant === undefined) {
        return res.status(500).send({message: "user not found"});
      } else {
        data[0].participants = data[0].participants.filter(participant => {
          return participant.userId !== req.body.userId
        });
        await groupsRepository.update(req.body.groupId, data[0]);
        return res.status(200).send({message: 'user removed from the group'});
      }
    } else if(self === undefined) {
      return res.status(500).send({message: "user not found"});
    } else {
      if(verify.id === req.body.userId) {
        data[0].participants = data[0].participants.filter(participant => {
          return participant.userId !== verify.id
        });
        await groupsRepository.update(req.body.groupId, data[0]);
        return res.status(200).send({message: 'user removed from the group'});
      } else {
        return res.status(500).send({message: "You dont have permission to remove someone else"});
      }
    }
  } catch(e) {
    return res.status(500).send({message: "failed on remove user to the group"});
  }

};
