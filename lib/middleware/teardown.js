
var request     = require("request")
var url         = require("url")
var helpers     = require("./util/helpers")
var path        = require("path")
var fs          = require("fs")
var os          = require("os")
var parseUrl    = require("url-parse-as-address")

module.exports = function(req, next, abort){

  var remove = function(domain){
    var options = {
      'url': url.resolve(req.endpoint, domain),
      'method': 'delete',
      'auth': {
        'user': "token",
        'pass': req.creds.token,
        'sendImmediately': true
      }
    }

    request(options, function(e, r, obj){
      if (e) throw e

      if (r.statusCode == 200 || r.statusCode == 204 || r.statusCode == 210) {
        helpers.log()
        helpers.log("    Success".green + " - " + domain + " has been removed.")
        helpers.log()
        process.exit()
      } else if (r.statusCode == 403) {
        helpers.log()
        helpers.log("    Aborted".yellow + " - unable to remove", domain)
        helpers.log()
        process.exit(1)
      } else {
        helpers.log()
        helpers.log(obj)
        helpers.log()
        process.exit()
      }
    })
  }

  return remove(parseUrl(req.domain).host)

}
