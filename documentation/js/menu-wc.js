'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">
                        <img alt="" class="img-responsive" data-type="custom-logo" data-src="images/logo_128p.png">
                    </a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                                <li class="link">
                                    <a href="overview.html" data-type="chapter-link">
                                        <span class="icon ion-ios-keypad"></span>Overview
                                    </a>
                                </li>

                            <li class="link">
                                <a href="index.html" data-type="chapter-link">
                                    <span class="icon ion-ios-paper"></span>
                                        README
                                </a>
                            </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>

                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AppModule-07471b00300104f08f4834ee7e03dbbb313122c7f237c249bf7adfb8d6171d3f88fe303a71271a354b5c1ceb9eb6d19e264a55784bbabc9d878e0c3ba1242418"' : 'data-bs-target="#xs-controllers-links-module-AppModule-07471b00300104f08f4834ee7e03dbbb313122c7f237c249bf7adfb8d6171d3f88fe303a71271a354b5c1ceb9eb6d19e264a55784bbabc9d878e0c3ba1242418"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AppModule-07471b00300104f08f4834ee7e03dbbb313122c7f237c249bf7adfb8d6171d3f88fe303a71271a354b5c1ceb9eb6d19e264a55784bbabc9d878e0c3ba1242418"' :
                                            'id="xs-controllers-links-module-AppModule-07471b00300104f08f4834ee7e03dbbb313122c7f237c249bf7adfb8d6171d3f88fe303a71271a354b5c1ceb9eb6d19e264a55784bbabc9d878e0c3ba1242418"' }>
                                            <li class="link">
                                                <a href="controllers/AppController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AppModule-07471b00300104f08f4834ee7e03dbbb313122c7f237c249bf7adfb8d6171d3f88fe303a71271a354b5c1ceb9eb6d19e264a55784bbabc9d878e0c3ba1242418"' : 'data-bs-target="#xs-injectables-links-module-AppModule-07471b00300104f08f4834ee7e03dbbb313122c7f237c249bf7adfb8d6171d3f88fe303a71271a354b5c1ceb9eb6d19e264a55784bbabc9d878e0c3ba1242418"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-07471b00300104f08f4834ee7e03dbbb313122c7f237c249bf7adfb8d6171d3f88fe303a71271a354b5c1ceb9eb6d19e264a55784bbabc9d878e0c3ba1242418"' :
                                        'id="xs-injectables-links-module-AppModule-07471b00300104f08f4834ee7e03dbbb313122c7f237c249bf7adfb8d6171d3f88fe303a71271a354b5c1ceb9eb6d19e264a55784bbabc9d878e0c3ba1242418"' }>
                                        <li class="link">
                                            <a href="injectables/AppService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/AuthService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AuthModule.html" data-type="entity-link" >AuthModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AuthModule-7defd10648a3edc6918f74703540aefa68db85f548adbdf360c8b860bacc73447cc56aec758ed99b8e4c8bf790c521f5198e144d78d977183c2b90c60cc536b3"' : 'data-bs-target="#xs-controllers-links-module-AuthModule-7defd10648a3edc6918f74703540aefa68db85f548adbdf360c8b860bacc73447cc56aec758ed99b8e4c8bf790c521f5198e144d78d977183c2b90c60cc536b3"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AuthModule-7defd10648a3edc6918f74703540aefa68db85f548adbdf360c8b860bacc73447cc56aec758ed99b8e4c8bf790c521f5198e144d78d977183c2b90c60cc536b3"' :
                                            'id="xs-controllers-links-module-AuthModule-7defd10648a3edc6918f74703540aefa68db85f548adbdf360c8b860bacc73447cc56aec758ed99b8e4c8bf790c521f5198e144d78d977183c2b90c60cc536b3"' }>
                                            <li class="link">
                                                <a href="controllers/AdminController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AdminController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/ApiKeyController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ApiKeyController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/AuthController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/EmailOtpController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EmailOtpController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/MagicLinkController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MagicLinkController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/MultiSessionController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MultiSessionController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/OrgsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OrgsController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/PasskeyController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PasskeyController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/TwoFactorController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TwoFactorController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/UsernameController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UsernameController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/UsersController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UsersController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AuthModule-7defd10648a3edc6918f74703540aefa68db85f548adbdf360c8b860bacc73447cc56aec758ed99b8e4c8bf790c521f5198e144d78d977183c2b90c60cc536b3"' : 'data-bs-target="#xs-injectables-links-module-AuthModule-7defd10648a3edc6918f74703540aefa68db85f548adbdf360c8b860bacc73447cc56aec758ed99b8e4c8bf790c521f5198e144d78d977183c2b90c60cc536b3"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthModule-7defd10648a3edc6918f74703540aefa68db85f548adbdf360c8b860bacc73447cc56aec758ed99b8e4c8bf790c521f5198e144d78d977183c2b90c60cc536b3"' :
                                        'id="xs-injectables-links-module-AuthModule-7defd10648a3edc6918f74703540aefa68db85f548adbdf360c8b860bacc73447cc56aec758ed99b8e4c8bf790c521f5198e144d78d977183c2b90c60cc536b3"' }>
                                        <li class="link">
                                            <a href="injectables/AdminService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AdminService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ApiKeyService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ApiKeyService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/AuthService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/EmailOtpService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EmailOtpService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/MagicLinkService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MagicLinkService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/MultiSessionService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MultiSessionService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/OrgsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OrgsService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/PasskeyService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PasskeyService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/TwoFactorService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TwoFactorService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UsernameService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UsernameService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UsersService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UsersService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/BunnyModule.html" data-type="entity-link" >BunnyModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-BunnyModule-f1ec8995080206d2f6039e397e6cbec196a929745d2ccf365716945e6c66077489dedfccfdbfa50608eb32826b4491996756ceb7d3ed51941c4b96e8ca7ad637"' : 'data-bs-target="#xs-injectables-links-module-BunnyModule-f1ec8995080206d2f6039e397e6cbec196a929745d2ccf365716945e6c66077489dedfccfdbfa50608eb32826b4491996756ceb7d3ed51941c4b96e8ca7ad637"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-BunnyModule-f1ec8995080206d2f6039e397e6cbec196a929745d2ccf365716945e6c66077489dedfccfdbfa50608eb32826b4491996756ceb7d3ed51941c4b96e8ca7ad637"' :
                                        'id="xs-injectables-links-module-BunnyModule-f1ec8995080206d2f6039e397e6cbec196a929745d2ccf365716945e6c66077489dedfccfdbfa50608eb32826b4491996756ceb7d3ed51941c4b96e8ca7ad637"' }>
                                        <li class="link">
                                            <a href="injectables/BunnyStorageService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BunnyStorageService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ConfigModule.html" data-type="entity-link" >ConfigModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-ConfigModule-6a0c11d586de85292c4055c95f709f49d1b38feefe98b28f2df8950d6c3adf566276340a3d72121c727871fc6da29435cfc24c866691f40cdd9828851b15c439"' : 'data-bs-target="#xs-injectables-links-module-ConfigModule-6a0c11d586de85292c4055c95f709f49d1b38feefe98b28f2df8950d6c3adf566276340a3d72121c727871fc6da29435cfc24c866691f40cdd9828851b15c439"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ConfigModule-6a0c11d586de85292c4055c95f709f49d1b38feefe98b28f2df8950d6c3adf566276340a3d72121c727871fc6da29435cfc24c866691f40cdd9828851b15c439"' :
                                        'id="xs-injectables-links-module-ConfigModule-6a0c11d586de85292c4055c95f709f49d1b38feefe98b28f2df8950d6c3adf566276340a3d72121c727871fc6da29435cfc24c866691f40cdd9828851b15c439"' }>
                                        <li class="link">
                                            <a href="injectables/AppConfigService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppConfigService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/DatabaseModule.html" data-type="entity-link" >DatabaseModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-DatabaseModule-48405c781389d163058913d05275f696fc66999d9a2011080fadef4673197bf0dcac25f8c9bbb72e873103b2462bdca1089f4a5a73882261a4a2dcba6c17275e"' : 'data-bs-target="#xs-injectables-links-module-DatabaseModule-48405c781389d163058913d05275f696fc66999d9a2011080fadef4673197bf0dcac25f8c9bbb72e873103b2462bdca1089f4a5a73882261a4a2dcba6c17275e"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-DatabaseModule-48405c781389d163058913d05275f696fc66999d9a2011080fadef4673197bf0dcac25f8c9bbb72e873103b2462bdca1089f4a5a73882261a4a2dcba6c17275e"' :
                                        'id="xs-injectables-links-module-DatabaseModule-48405c781389d163058913d05275f696fc66999d9a2011080fadef4673197bf0dcac25f8c9bbb72e873103b2462bdca1089f4a5a73882261a4a2dcba6c17275e"' }>
                                        <li class="link">
                                            <a href="injectables/DatabaseService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DatabaseService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/HealthModule.html" data-type="entity-link" >HealthModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-HealthModule-6c3ba330bb0f0316388888353e8d13ca3679a18c924c03416f2995f324235a9f2a7f0857f6d5ee4914eb56ddd149ebecf456ddc800e135c7f9ea3dcf3306e3d7"' : 'data-bs-target="#xs-controllers-links-module-HealthModule-6c3ba330bb0f0316388888353e8d13ca3679a18c924c03416f2995f324235a9f2a7f0857f6d5ee4914eb56ddd149ebecf456ddc800e135c7f9ea3dcf3306e3d7"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-HealthModule-6c3ba330bb0f0316388888353e8d13ca3679a18c924c03416f2995f324235a9f2a7f0857f6d5ee4914eb56ddd149ebecf456ddc800e135c7f9ea3dcf3306e3d7"' :
                                            'id="xs-controllers-links-module-HealthModule-6c3ba330bb0f0316388888353e8d13ca3679a18c924c03416f2995f324235a9f2a7f0857f6d5ee4914eb56ddd149ebecf456ddc800e135c7f9ea3dcf3306e3d7"' }>
                                            <li class="link">
                                                <a href="controllers/HealthController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HealthController</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#entities-links"' :
                                'data-bs-target="#xs-entities-links"' }>
                                <span class="icon ion-ios-apps"></span>
                                <span>Entities</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="entities-links"' : 'id="xs-entities-links"' }>
                                <li class="link">
                                    <a href="entities/Account.html" data-type="entity-link" >Account</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Apikey.html" data-type="entity-link" >Apikey</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Category.html" data-type="entity-link" >Category</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Endorsement.html" data-type="entity-link" >Endorsement</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Game.html" data-type="entity-link" >Game</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Invitation.html" data-type="entity-link" >Invitation</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Jwks.html" data-type="entity-link" >Jwks</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Member.html" data-type="entity-link" >Member</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Modpack.html" data-type="entity-link" >Modpack</a>
                                </li>
                                <li class="link">
                                    <a href="entities/ModpackItem.html" data-type="entity-link" >ModpackItem</a>
                                </li>
                                <li class="link">
                                    <a href="entities/OauthAccessToken.html" data-type="entity-link" >OauthAccessToken</a>
                                </li>
                                <li class="link">
                                    <a href="entities/OauthClient.html" data-type="entity-link" >OauthClient</a>
                                </li>
                                <li class="link">
                                    <a href="entities/OauthConsent.html" data-type="entity-link" >OauthConsent</a>
                                </li>
                                <li class="link">
                                    <a href="entities/OauthRefreshToken.html" data-type="entity-link" >OauthRefreshToken</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Organization.html" data-type="entity-link" >Organization</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Passkey.html" data-type="entity-link" >Passkey</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Project.html" data-type="entity-link" >Project</a>
                                </li>
                                <li class="link">
                                    <a href="entities/ProjectComment.html" data-type="entity-link" >ProjectComment</a>
                                </li>
                                <li class="link">
                                    <a href="entities/ProjectFile.html" data-type="entity-link" >ProjectFile</a>
                                </li>
                                <li class="link">
                                    <a href="entities/ProjectRelationship.html" data-type="entity-link" >ProjectRelationship</a>
                                </li>
                                <li class="link">
                                    <a href="entities/ProjectRelease.html" data-type="entity-link" >ProjectRelease</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Session.html" data-type="entity-link" >Session</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Subscription.html" data-type="entity-link" >Subscription</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Tag.html" data-type="entity-link" >Tag</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Team.html" data-type="entity-link" >Team</a>
                                </li>
                                <li class="link">
                                    <a href="entities/TeamMember.html" data-type="entity-link" >TeamMember</a>
                                </li>
                                <li class="link">
                                    <a href="entities/TwoFactor.html" data-type="entity-link" >TwoFactor</a>
                                </li>
                                <li class="link">
                                    <a href="entities/User.html" data-type="entity-link" >User</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Verification.html" data-type="entity-link" >Verification</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/AuthResponseHelper.html" data-type="entity-link" >AuthResponseHelper</a>
                            </li>
                            <li class="link">
                                <a href="classes/BanUserDto.html" data-type="entity-link" >BanUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/BetterAuthExceptionFilter.html" data-type="entity-link" >BetterAuthExceptionFilter</a>
                            </li>
                            <li class="link">
                                <a href="classes/ChangeEmailDto.html" data-type="entity-link" >ChangeEmailDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ChangePasswordDto.html" data-type="entity-link" >ChangePasswordDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateApiKeyDto.html" data-type="entity-link" >CreateApiKeyDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateOrganizationDto.html" data-type="entity-link" >CreateOrganizationDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateTeamDto.html" data-type="entity-link" >CreateTeamDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateUserAdminDto.html" data-type="entity-link" >CreateUserAdminDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeleteAccountDto.html" data-type="entity-link" >DeleteAccountDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/DisableTwoFactorDto.html" data-type="entity-link" >DisableTwoFactorDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/EnableTwoFactorDto.html" data-type="entity-link" >EnableTwoFactorDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/Endorsement.html" data-type="entity-link" >Endorsement</a>
                            </li>
                            <li class="link">
                                <a href="classes/ForgetPasswordDto.html" data-type="entity-link" >ForgetPasswordDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/GenerateBackupCodesDTO.html" data-type="entity-link" >GenerateBackupCodesDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/GenerateTotpUriDto.html" data-type="entity-link" >GenerateTotpUriDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/HasPermissionDto.html" data-type="entity-link" >HasPermissionDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ImpersonateDto.html" data-type="entity-link" >ImpersonateDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/InviteMemberDto.html" data-type="entity-link" >InviteMemberDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/LinkSocialDto.html" data-type="entity-link" >LinkSocialDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/RemoveMemberDto.html" data-type="entity-link" >RemoveMemberDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/RemoveUserDto.html" data-type="entity-link" >RemoveUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ResetPasswordDto.html" data-type="entity-link" >ResetPasswordDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/RevokeSessionDto.html" data-type="entity-link" >RevokeSessionDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/RevokeUserSessionDto.html" data-type="entity-link" >RevokeUserSessionDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/SendEmailOtpDto.html" data-type="entity-link" >SendEmailOtpDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/SendMagicLinkDto.html" data-type="entity-link" >SendMagicLinkDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/SendVerificationEmailDto.html" data-type="entity-link" >SendVerificationEmailDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/SetActiveSessionDto.html" data-type="entity-link" >SetActiveSessionDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/SetUserRoleDto.html" data-type="entity-link" >SetUserRoleDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/SignInEmailDto.html" data-type="entity-link" >SignInEmailDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/SignInUsernameDto.html" data-type="entity-link" >SignInUsernameDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/SignInWithEmailOtpDto.html" data-type="entity-link" >SignInWithEmailOtpDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/SignUpEmailDto.html" data-type="entity-link" >SignUpEmailDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/TeamMemberDto.html" data-type="entity-link" >TeamMemberDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UnbanUserDto.html" data-type="entity-link" >UnbanUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UnlinkSocialDto.html" data-type="entity-link" >UnlinkSocialDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateApiKeyDto.html" data-type="entity-link" >UpdateApiKeyDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateMemberRoleDto.html" data-type="entity-link" >UpdateMemberRoleDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateOrganizationDto.html" data-type="entity-link" >UpdateOrganizationDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateSessionDto.html" data-type="entity-link" >UpdateSessionDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateTeamDto.html" data-type="entity-link" >UpdateTeamDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateUserDto.html" data-type="entity-link" >UpdateUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateUsernameDto.html" data-type="entity-link" >UpdateUsernameDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/VerifyBackupCodeDto.html" data-type="entity-link" >VerifyBackupCodeDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/VerifyEmailOtpDto.html" data-type="entity-link" >VerifyEmailOtpDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/VerifyPasskeyAuthenticationDto.html" data-type="entity-link" >VerifyPasskeyAuthenticationDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/VerifyPasskeyRegistrationDto.html" data-type="entity-link" >VerifyPasskeyRegistrationDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/VerifyTotpDto.html" data-type="entity-link" >VerifyTotpDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ViewBackupCodesDTO.html" data-type="entity-link" >ViewBackupCodesDTO</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/AppConfig.html" data-type="entity-link" >AppConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AuthConfig.html" data-type="entity-link" >AuthConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BetterAuthError.html" data-type="entity-link" >BetterAuthError</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BunnyConfig.html" data-type="entity-link" >BunnyConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BunnyDownloadResult.html" data-type="entity-link" >BunnyDownloadResult</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ConfigMap.html" data-type="entity-link" >ConfigMap</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DatabaseConfig.html" data-type="entity-link" >DatabaseConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/HealthDownResponse.html" data-type="entity-link" >HealthDownResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/HealthUpResponse.html" data-type="entity-link" >HealthUpResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/OAuthProviderConfig.html" data-type="entity-link" >OAuthProviderConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StripeConfig.html" data-type="entity-link" >StripeConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StripeKeySet.html" data-type="entity-link" >StripeKeySet</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});