/*
 * Piwik - Web Analytics
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html Gpl v3 or later
 * @version $Id$
 */
 
/**
 * @class  Provides the ability to manage multiple user accounts of multiple piwik server installations. Each created
 *         account will be stored beyond application settings currently.
 */
function AccountModel () {

    /**
     * These are the mandatory properties in order to create a new account. Creating an account without specified each
     * of these properties will not work. These properties can also be updated.
     * 
     * @type Array
     *
     * Array (
     *     [accessUrl] => [{string} The access URL to the piwik server. Value should start with 'https://' to do an encrypted request, 'http' otherwise]
     *     [username]  => [{string} The userLogin of a piwik user. {@link http://dev.piwik.org/trac/wiki/API/Reference#UsersManager}]
     *     [tokenAuth] => [{string} The token_auth which identifies the user in rest API calls {@link http://dev.piwik.org/trac/wiki/API/Reference#Makeanauthenticatedcall}]
     * )
     *
     * @private
     */
    this.mandatoryFields = ['accessUrl', 'username', 'tokenAuth']; 

    /**
     * These are optional properties in order to create a new account or update an existing account. 
     * id, createVersionNumber and changeVersionNumber will be set automatically. 
     * 
     * @type Array
     *
     * Array (
     *     [id]                   => [{string} An unique id which identifies the account. Will be generated automatically]
     *     [name]                 => [{string} The name of the account. User can specify any name. Intended only for visual purposes so that the user can identify the account]
     *     [active]               => [{int}    0 if the account is inactive, 1 otherwise. Do not request statistics of an inactive account]
     *     [createVersionNumber]  => [{string} The current version number of the app when the account was created. Will be set automatically]
     *     [changeVersionNumber]  => [{string} The current version number of the app when the account was changed at last. Will be set automatically]
     * )
     *
     * @private
     */
    this.optionalFields  = ['id', 'name', 'active', 'createVersionNumber', 'changeVersionNumber'];

    /**
     * Returns all available accounts, even inactive ones. Returns an empty array if no account exists.
     *
     * @returns {Array} An array containing multiple accounts in the following format:
     *    Array (
     *       [int] => Object (
     *                   [id]                   => [See {@link AccountModel#optionalFields}]
     *                   [name]                 => [See {@link AccountModel#optionalFields}]
     *                   [active]               => [See {@link AccountModel#optionalFields}]
     *                   [createVersionNumber]  => [See {@link AccountModel#optionalFields}]
     *                   [changeVersionNumber]  => [See {@link AccountModel#optionalFields}]
     *                   [accessUrl]            => [See {@link AccountModel#mandatoryFields}]
     *                   [username]             => [See {@link AccountModel#mandatoryFields}]
     *                   [tokenAuth]            => [See {@link AccountModel#mandatoryFields}]
     *               )
     *   )
     */
    this.getAccounts = function () {
    
        var accountIds  = Cache.get('accounts_available');
        
        if (!accountIds || Cache.KEY_NOT_FOUND == accountIds || 0 == accountIds.length) {
            return [];
        }
        
        var accounts    = [];
        
        for (var index  = 0; index < accountIds.length; index++) {
            var account = this.getAccountById(accountIds[index]);
            
            if (!account || Cache.KEY_NOT_FOUND == account) {
                delete accountIds[index];
                Cache.set('accounts_available', accountIds, null);
                
                continue;
            }
        
            accounts.push(account);
        }

        return accounts;
    };

    /**
     * Verifies whether the user has already defined at least one active account.
     *
     * @returns {boolean} true if the user already has an active account, false otherwise.
     */
    this.hasActivedAccount = function () {
    
        var accountIds  = Cache.get('accounts_available');
        
        if (!accountIds || Cache.KEY_NOT_FOUND == accountIds || 0 == accountIds.length) {
        
            return false;
        }
        
        var accounts    = [];
        
        for (var index  = 0; index < accountIds.length; index++) {
            var account = this.getAccountById(accountIds[index]);
            
            if (!account || Cache.KEY_NOT_FOUND == account || !Boolean(account.active)) {
                
                continue;
            }
        
            return true;
        }

        return false;
    };

    /**
     * Fetches an already existing account by the given account id. 
     *
     * @param {int}  id    The unique id of the account you want to retrieve.
     *
     * @returns {Object|null} null if the account does not exist. An object containing the account information otherwise.
     *   Object (
     *       [id]                   => [See {@link AccountModel#optionalFields}]
     *       [name]                 => [See {@link AccountModel#optionalFields}]
     *       [active]               => [See {@link AccountModel#optionalFields}]
     *       [createVersionNumber]  => [See {@link AccountModel#optionalFields}]
     *       [changeVersionNumber]  => [See {@link AccountModel#optionalFields}]
     *       [accessUrl]            => [See {@link AccountModel#mandatoryFields}]
     *       [username]             => [See {@link AccountModel#mandatoryFields}]
     *       [tokenAuth]            => [See {@link AccountModel#mandatoryFields}]
     *   )
     */
    this.getAccountById = function (id) {

        if (!id) {
        
            return;
        }
        
        var account = Cache.get('account_' + id);
           
        if (!account || Cache.KEY_NOT_FOUND == account) {
            
            return;
        }
        
        return account;
    };

    /**
     * Creates a new account.
     *
     * @param   {Object}  account
     * @param   {string}  account.accessUrl    See {@link AccountModel#mandatoryFields}
     * @param   {string}  account.username     See {@link AccountModel#mandatoryFields}
     * @param   {string}  account.tokenAuth    See {@link AccountModel#mandatoryFields}
     * @param   {string}  [account.name]       Optional, see {@link AccountModel#optionalFields}
     * @param   {int}     [account.active=1]   Optional, see {@link AccountModel#optionalFields}
     *
     * @returns {string|null}    null if an error occurred. For example if not all mandatory properties are specified.
     *                           The id of the created account otherwise.
     */
    this.createAccount = function (account) {
        if (!account || !(account instanceof Object)) {
        
            return;
        }
        
        var values = {};
        
        values.id                  = Titanium.Platform.createUUID();
        values.createVersionNumber = Titanium.App.version;
        values.changeVersionNumber = null;
        
        if ('undefined' === (typeof account.active) || null === account.active)  {
            values.active = 1;
        }

        var fieldName;
        for (var index = 0; index < this.mandatoryFields.length; index++) {
            fieldName = this.mandatoryFields[index];
            
            if ('undefined' === (typeof account[fieldName])) {
                // @todo throw an error here?
                
                return;
            }
            
            values[fieldName] = account[fieldName];
        }
        
        for (index = 0; index < this.optionalFields.length; index++) {
            fieldName = this.optionalFields[index];
            
            if ('undefined' === (typeof account[fieldName])) {
                
                if ('undefined' === (typeof values[fieldName])) {
                    values[fieldName] = null;
                }
                
                continue;
            }
            
            values[fieldName] = account[fieldName];
        }
        
        Cache.set('account_' + values.id, values, null);
        
        var accountIds  = Cache.get('accounts_available');
        
        if (!accountIds || Cache.KEY_NOT_FOUND == accountIds || 0 == accountIds.length) {
            accountIds = [];
        }
        
        accountIds.push(values.id);
        
        Cache.set('accounts_available', accountIds, null);
        
        return values.id;
    };

    /**
     * Updates the values of an already existing account. Changes only specified properties.
     *
     * @param   {string}  id                     The id of the account you want to update
     * @param   {Object}  account
     * @param   {string}  [account.accessUrl]    Optional, see {@link AccountModel#mandatoryFields}
     * @param   {string}  [account.username]     Optional, see {@link AccountModel#mandatoryFields}
     * @param   {string}  [account.tokenAuth]    Optional, see {@link AccountModel#mandatoryFields}
     * @param   {string}  [account.name]         Optional, see {@link AccountModel#optionalFields}
     * @param   {int}     [account.active]       Optional, see {@link AccountModel#optionalFields}
     *
     * @returns {boolean}    true on success, false otherwise.
     */
    this.updateAccount = function (id, account) {
        
        if (!id || !account || !(account instanceof Object)) {
        
            return false;
        }
        
        var values                 = this.getAccountById(id);
        values.changeVersionNumber = Titanium.App.version;

        var allowedFields          = this.mandatoryFields.concat(this.optionalFields);
        var fieldName;
        
        for (var index = 0; index < allowedFields.length; index++) {
            fieldName  = allowedFields[index];
            
            if ('undefined' !== (typeof account[fieldName])) {
                
                values[fieldName] = account[fieldName];
            }
        }
        
        Cache.set('account_' + values.id, values, null);
        
        return true;
    };

    /**
     * Deletes an existing account (forever).
     *
     * @param   {string}  id   The id of the account you want to delete.
     *
     * @type null
     */
    this.deleteAccount = function (id) {
        if (!id) {
        
            return false;
        }
        
        Cache.remove('account_' + id);
    };

    /**
     * Activates an existing account.
     *
     * @param   {string}  id   The id of the account you want to activate.
     *
     * @returns {boolean}      true on success, false otherwise.
     */
    this.activateAccount = function (id) {
        
        return this.updateAccount(id, {active: 1});
    };

    /**
     * Deactivates an existing account.
     *
     * @param   {string}  id   The id of the account you want to deactivate.
     *
     * @returns {boolean}      true on success, false otherwise.
     */
    this.deactivateAccount = function (id) {
        
        return this.updateAccount(id, {active: 0});
    };
};
