//
//   Function used for Circular Delegation Check
//   Checks if inbound delegation, matches outbound delegation
//
function traverseCheck(delegate, userDelegate, domain) {
  // Circular delegation only possible nly if delegate has outbound delegations
  var delegateProfile = Meteor.users.findOne({_id: delegate});
  if (delegateProfile.delegates) {
    delegateProfile.delegates.forEach(function(delegation) {
      userDelegate.delegations.forEach(function(userDelegations) {
        if (userDelegations.voter === delegation.delegate &&
            userDelegations.domain === delegation.domain) {
          throw new Meteor.Error('circularDelegation', ' Your Delegation would creat a circular Delegation and is therefore currently not possible. Please check your delegation relationships and retry again.')
        }
        else {
          traverseCheck(delegation.delegate, userDelegate, domain)
        }
      })
    })
  }
}


function circularDelegation(user, delegate, domain) {
  // If the current user is a delegate herself, check for circular delegation
  if (user.delegate) {
    var userDelegate = Delegates.findOne({_id: user._id});

    // Circular delegation only possible if user already has existing inbound delegations
    if (userDelegate.delegations) {
      // Check if inbound delegation matches outbound delegation
      traverseCheck(delegate, userDelegate, domain);
    }
  }
}
