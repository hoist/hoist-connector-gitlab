import {OAuth2ConnectorBase} from '@hoist/oauth-connector';
import {merge} from 'lodash';

let overrides = {
  baseSite: 'https://gitlab.com',
  accessTokenPath: '/oauth/token'
};
let apiBaseUri = 'https://gitlab.com/api/v3'
/**
   * A Hoist Connector for connecting to GitLab
   * @extends {OAuth2ConnectorBase}
   */
export default class GitLabConnector extends OAuth2ConnectorBase {

  /**
   * create a new connector
   * @param {object} configuration - the configuration properties to use
   * @param {string} configuration.clientId - the OAuth2 client id
   * @param {string} configuration.clientSecret - the OAuth2 client secret
   */
  constructor (configuration) {
    super(merge({}, configuration, overrides));
    this._clientId = configuration.clientId;
    this._configuration = configuration;
  }

  /**
   * @private
   * @param AuthorizationStore authorization the users authorisation store
   * @returns Promise<object> an object containing key value pairs to send with the client to the authorization url
   */
  _authorizeParams (authorization) {
    return super._authorizeParams(authorization).then((params) => {
      params.response_type = "code";
      return params;
    });
  }
  //use authorization params as it has redirect uri
  _accessParams (authorization) {
    return super._authorizeParams(authorization).then((params) => {
      return params || {};
    }).then((params) => {
      params.grant_type = "authorization_code"
      return params;
    });
  }
  static defaultSettings () {
    return Promise.resolve({});
  }

  get (path) {
    let uri = `${apiBaseUri}${path}`;
    return this._performRequest('GET', uri).then((result) => {
      return JSON.parse(result);
    });
  }
  post (path, body) {
    let uri = `${apiBaseUri}${path}`;
    return this._performRequest('POST', uri, body).then((result) => {
      return JSON.parse(result);
    });
  }
  put (path, body) {
    let uri = `${apiBaseUri}${path}`;
    return this._performRequest('PUT', uri, body).then((result) => {
      return JSON.parse(result);
    });
  }
  patch (path, body) {
    let uri = `${apiBaseUri}${path}`;
    return this._performRequest('PATCH', uri, body).then((result) => {
      return JSON.parse(result);
    });
  }
  delete (path) {
    let uri = `${apiBaseUri}${path}`;
    return this._performRequest('DELETE', uri).then((result) => {
      return JSON.parse(result);
    });
  }
  intercept(authorization) {
    return authorization.raise(this._configuration._connectorKey + ':new:event', authorization.payload);
  }
}

/**
 * @external {OAuth2ConnectorBase} https://doc.esdoc.org/github.com/hoist/oauth-connector/class/src/oauth2_connector.js~OAuth2ConnectorBase.html
 */
