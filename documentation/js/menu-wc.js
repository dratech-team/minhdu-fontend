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
                    <a href="index.html" data-type="index-link">minhdu-fontend documentation</a>
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
                                <span class="icon ion-ios-paper"></span>README
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
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AppModule-ae5b9fb78f0f65dd0463f1ca3b93546b4872f46dd39674ec316ddacd6158199da1e8a494e72f6a447dda513b585ef324d0e551d5c4fb5a096aaa3b5142edc963"' : 'data-target="#xs-components-links-module-AppModule-ae5b9fb78f0f65dd0463f1ca3b93546b4872f46dd39674ec316ddacd6158199da1e8a494e72f6a447dda513b585ef324d0e551d5c4fb5a096aaa3b5142edc963"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-ae5b9fb78f0f65dd0463f1ca3b93546b4872f46dd39674ec316ddacd6158199da1e8a494e72f6a447dda513b585ef324d0e551d5c4fb5a096aaa3b5142edc963"' :
                                            'id="xs-components-links-module-AppModule-ae5b9fb78f0f65dd0463f1ca3b93546b4872f46dd39674ec316ddacd6158199da1e8a494e72f6a447dda513b585ef324d0e551d5c4fb5a096aaa3b5142edc963"' }>
                                            <li class="link">
                                                <a href="components/AppComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PageLayoutComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PageLayoutComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link" >AppRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/ContractModule.html" data-type="entity-link" >ContractModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/EmployeeModule.html" data-type="entity-link" >EmployeeModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-EmployeeModule-aaa80104f99b2b5fca1edfa878941e57ecf0a214c51fddee582283c802f02857669106b31426e3d77ac84f834418d3e5d1270369ee73582b64b1c3da2eb35625"' : 'data-target="#xs-components-links-module-EmployeeModule-aaa80104f99b2b5fca1edfa878941e57ecf0a214c51fddee582283c802f02857669106b31426e3d77ac84f834418d3e5d1270369ee73582b64b1c3da2eb35625"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-EmployeeModule-aaa80104f99b2b5fca1edfa878941e57ecf0a214c51fddee582283c802f02857669106b31426e3d77ac84f834418d3e5d1270369ee73582b64b1c3da2eb35625"' :
                                            'id="xs-components-links-module-EmployeeModule-aaa80104f99b2b5fca1edfa878941e57ecf0a214c51fddee582283c802f02857669106b31426e3d77ac84f834418d3e5d1270369ee73582b64b1c3da2eb35625"' }>
                                            <li class="link">
                                                <a href="components/DetailEmployeeComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DetailEmployeeComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EmployeeComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EmployeeComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ModalDegreeComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ModalDegreeComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ModalEmployeeComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ModalEmployeeComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ModalRelativeComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ModalRelativeComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ModalUpdateContractComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ModalUpdateContractComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ProfileComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProfileComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#pipes-links-module-EmployeeModule-aaa80104f99b2b5fca1edfa878941e57ecf0a214c51fddee582283c802f02857669106b31426e3d77ac84f834418d3e5d1270369ee73582b64b1c3da2eb35625"' : 'data-target="#xs-pipes-links-module-EmployeeModule-aaa80104f99b2b5fca1edfa878941e57ecf0a214c51fddee582283c802f02857669106b31426e3d77ac84f834418d3e5d1270369ee73582b64b1c3da2eb35625"' }>
                                            <span class="icon ion-md-add"></span>
                                            <span>Pipes</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="pipes-links-module-EmployeeModule-aaa80104f99b2b5fca1edfa878941e57ecf0a214c51fddee582283c802f02857669106b31426e3d77ac84f834418d3e5d1270369ee73582b64b1c3da2eb35625"' :
                                            'id="xs-pipes-links-module-EmployeeModule-aaa80104f99b2b5fca1edfa878941e57ecf0a214c51fddee582283c802f02857669106b31426e3d77ac84f834418d3e5d1270369ee73582b64b1c3da2eb35625"' }>
                                            <li class="link">
                                                <a href="pipes/ExistPipe.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ExistPipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/FlatSalaryTypePipe.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FlatSalaryTypePipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/WorkHistoryPipe.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >WorkHistoryPipe</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/EmployeeRoutingModule.html" data-type="entity-link" >EmployeeRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/OrgchartModule.html" data-type="entity-link" >OrgchartModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-OrgchartModule-58d9cf8822ac76bd253d49446b3a9c518a98f8b1eec2786b45a87ca0ab3a27d3296b0cef6824189bb27b94966a579dec530f0f3ed3ccbd8fc2c94278db7d9900"' : 'data-target="#xs-components-links-module-OrgchartModule-58d9cf8822ac76bd253d49446b3a9c518a98f8b1eec2786b45a87ca0ab3a27d3296b0cef6824189bb27b94966a579dec530f0f3ed3ccbd8fc2c94278db7d9900"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-OrgchartModule-58d9cf8822ac76bd253d49446b3a9c518a98f8b1eec2786b45a87ca0ab3a27d3296b0cef6824189bb27b94966a579dec530f0f3ed3ccbd8fc2c94278db7d9900"' :
                                            'id="xs-components-links-module-OrgchartModule-58d9cf8822ac76bd253d49446b3a9c518a98f8b1eec2786b45a87ca0ab3a27d3296b0cef6824189bb27b94966a579dec530f0f3ed3ccbd8fc2c94278db7d9900"' }>
                                            <li class="link">
                                                <a href="components/AllowanceBranchComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AllowanceBranchComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/BranchComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BranchComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DepartmentComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DepartmentComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DetailBranchComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DetailBranchComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ModalBranchComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ModalBranchComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ModalDepartmentComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ModalDepartmentComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ModalPositionComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ModalPositionComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PositionComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PositionComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/OrgchartRoutingModule.html" data-type="entity-link" >OrgchartRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/OverviewHrModule.html" data-type="entity-link" >OverviewHrModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-OverviewHrModule-15d6d30cfa2f329b2eeb5a26cfa2be61780f188e4d084c312f3cc86a4324eb95aba97504f7cb465013855c973a14cb4fd64cec6ef133ffb43ade8bcb4ee18ffb"' : 'data-target="#xs-components-links-module-OverviewHrModule-15d6d30cfa2f329b2eeb5a26cfa2be61780f188e4d084c312f3cc86a4324eb95aba97504f7cb465013855c973a14cb4fd64cec6ef133ffb43ade8bcb4ee18ffb"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-OverviewHrModule-15d6d30cfa2f329b2eeb5a26cfa2be61780f188e4d084c312f3cc86a4324eb95aba97504f7cb465013855c973a14cb4fd64cec6ef133ffb43ade8bcb4ee18ffb"' :
                                            'id="xs-components-links-module-OverviewHrModule-15d6d30cfa2f329b2eeb5a26cfa2be61780f188e4d084c312f3cc86a4324eb95aba97504f7cb465013855c973a14cb4fd64cec6ef133ffb43ade8bcb4ee18ffb"' }>
                                            <li class="link">
                                                <a href="components/OverviewHrComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OverviewHrComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/StatisticalEmployeeComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StatisticalEmployeeComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/OverviewHrRoutingModule.html" data-type="entity-link" >OverviewHrRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/PayrollModule.html" data-type="entity-link" >PayrollModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-PayrollModule-59ba58ff0d1fdd0b8d347dd7fa23e86bfd6f023c8091c3b4d344522070e15c209d63ec142f479b48010948db15674bf4ace7fa7f361236cace87c6a315792fc1"' : 'data-target="#xs-components-links-module-PayrollModule-59ba58ff0d1fdd0b8d347dd7fa23e86bfd6f023c8091c3b4d344522070e15c209d63ec142f479b48010948db15674bf4ace7fa7f361236cace87c6a315792fc1"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-PayrollModule-59ba58ff0d1fdd0b8d347dd7fa23e86bfd6f023c8091c3b4d344522070e15c209d63ec142f479b48010948db15674bf4ace7fa7f361236cace87c6a315792fc1"' :
                                            'id="xs-components-links-module-PayrollModule-59ba58ff0d1fdd0b8d347dd7fa23e86bfd6f023c8091c3b4d344522070e15c209d63ec142f479b48010948db15674bf4ace7fa7f361236cace87c6a315792fc1"' }>
                                            <li class="link">
                                                <a href="components/AllowanceSalaryComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AllowanceSalaryComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ClassifySalaryComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ClassifySalaryComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DetailPayrollComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DetailPayrollComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HistoryPayrollComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HistoryPayrollComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ModalSelectAddSalaryComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ModalSelectAddSalaryComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PayrollComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PayrollComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PayslipComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PayslipComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TablePayrollComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TablePayrollComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/UpdatePayrollComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UpdatePayrollComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#pipes-links-module-PayrollModule-59ba58ff0d1fdd0b8d347dd7fa23e86bfd6f023c8091c3b4d344522070e15c209d63ec142f479b48010948db15674bf4ace7fa7f361236cace87c6a315792fc1"' : 'data-target="#xs-pipes-links-module-PayrollModule-59ba58ff0d1fdd0b8d347dd7fa23e86bfd6f023c8091c3b4d344522070e15c209d63ec142f479b48010948db15674bf4ace7fa7f361236cace87c6a315792fc1"' }>
                                            <span class="icon ion-md-add"></span>
                                            <span>Pipes</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="pipes-links-module-PayrollModule-59ba58ff0d1fdd0b8d347dd7fa23e86bfd6f023c8091c3b4d344522070e15c209d63ec142f479b48010948db15674bf4ace7fa7f361236cace87c6a315792fc1"' :
                                            'id="xs-pipes-links-module-PayrollModule-59ba58ff0d1fdd0b8d347dd7fa23e86bfd6f023c8091c3b4d344522070e15c209d63ec142f479b48010948db15674bf4ace7fa7f361236cace87c6a315792fc1"' }>
                                            <li class="link">
                                                <a href="pipes/FilterPipe.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FilterPipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/RangeDateTimePipe.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RangeDateTimePipe</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/PayrollRoutingModule.html" data-type="entity-link" >PayrollRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/RankModule.html" data-type="entity-link" >RankModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-RankModule-98cdedce46e3d418892ef57a80e4eeb464859db728e1d067e270d19452feb2c1d7557c787488d5e17d30210cbb170ef1293655373b017282b75c58669eb2dac1"' : 'data-target="#xs-components-links-module-RankModule-98cdedce46e3d418892ef57a80e4eeb464859db728e1d067e270d19452feb2c1d7557c787488d5e17d30210cbb170ef1293655373b017282b75c58669eb2dac1"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-RankModule-98cdedce46e3d418892ef57a80e4eeb464859db728e1d067e270d19452feb2c1d7557c787488d5e17d30210cbb170ef1293655373b017282b75c58669eb2dac1"' :
                                            'id="xs-components-links-module-RankModule-98cdedce46e3d418892ef57a80e4eeb464859db728e1d067e270d19452feb2c1d7557c787488d5e17d30210cbb170ef1293655373b017282b75c58669eb2dac1"' }>
                                            <li class="link">
                                                <a href="components/RankComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RankComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SettingBonusComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SettingBonusComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SettingRankComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SettingRankComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/RankRoutingModule.html" data-type="entity-link" >RankRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/SalaryModule.html" data-type="entity-link" >SalaryModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-SalaryModule-4ceddf266865d978e56bd30acd01a6ea53081a85827f69dc20dd62904c6fdba4c2f4dd9c20b16696b020ed7bb2714d60393272a60d7d12ab37684241a0b762f0"' : 'data-target="#xs-components-links-module-SalaryModule-4ceddf266865d978e56bd30acd01a6ea53081a85827f69dc20dd62904c6fdba4c2f4dd9c20b16696b020ed7bb2714d60393272a60d7d12ab37684241a0b762f0"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SalaryModule-4ceddf266865d978e56bd30acd01a6ea53081a85827f69dc20dd62904c6fdba4c2f4dd9c20b16696b020ed7bb2714d60393272a60d7d12ab37684241a0b762f0"' :
                                            'id="xs-components-links-module-SalaryModule-4ceddf266865d978e56bd30acd01a6ea53081a85827f69dc20dd62904c6fdba4c2f4dd9c20b16696b020ed7bb2714d60393272a60d7d12ab37684241a0b762f0"' }>
                                            <li class="link">
                                                <a href="components/AbsentOvertimeSalaryComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AbsentOvertimeSalaryComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DeductionSalaryComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DeductionSalaryComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HolidaySalaryComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HolidaySalaryComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PermanentSalaryComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PermanentSalaryComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RemoteOrDayOffSalaryComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RemoteOrDayOffSalaryComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TableSalarySelectedComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TableSalarySelectedComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#pipes-links-module-SalaryModule-4ceddf266865d978e56bd30acd01a6ea53081a85827f69dc20dd62904c6fdba4c2f4dd9c20b16696b020ed7bb2714d60393272a60d7d12ab37684241a0b762f0"' : 'data-target="#xs-pipes-links-module-SalaryModule-4ceddf266865d978e56bd30acd01a6ea53081a85827f69dc20dd62904c6fdba4c2f4dd9c20b16696b020ed7bb2714d60393272a60d7d12ab37684241a0b762f0"' }>
                                            <span class="icon ion-md-add"></span>
                                            <span>Pipes</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="pipes-links-module-SalaryModule-4ceddf266865d978e56bd30acd01a6ea53081a85827f69dc20dd62904c6fdba4c2f4dd9c20b16696b020ed7bb2714d60393272a60d7d12ab37684241a0b762f0"' :
                                            'id="xs-pipes-links-module-SalaryModule-4ceddf266865d978e56bd30acd01a6ea53081a85827f69dc20dd62904c6fdba4c2f4dd9c20b16696b020ed7bb2714d60393272a60d7d12ab37684241a0b762f0"' }>
                                            <li class="link">
                                                <a href="pipes/PartialdayPipe.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PartialdayPipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/TransformSalaryTypePipe.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TransformSalaryTypePipe</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/SettingModule.html" data-type="entity-link" >SettingModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-SettingModule-2bb887d9d41e7806aa65ab59be6ca871ce4af23a981f34b36ca17c51e1048f7e0aa8f849b9650690134fec0a62916bd47c75c4c79fa0387d288cdb7bedda6276"' : 'data-target="#xs-components-links-module-SettingModule-2bb887d9d41e7806aa65ab59be6ca871ce4af23a981f34b36ca17c51e1048f7e0aa8f849b9650690134fec0a62916bd47c75c4c79fa0387d288cdb7bedda6276"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SettingModule-2bb887d9d41e7806aa65ab59be6ca871ce4af23a981f34b36ca17c51e1048f7e0aa8f849b9650690134fec0a62916bd47c75c4c79fa0387d288cdb7bedda6276"' :
                                            'id="xs-components-links-module-SettingModule-2bb887d9d41e7806aa65ab59be6ca871ce4af23a981f34b36ca17c51e1048f7e0aa8f849b9650690134fec0a62916bd47c75c4c79fa0387d288cdb7bedda6276"' }>
                                            <li class="link">
                                                <a href="components/ModalSettingSalaryComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ModalSettingSalaryComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SettingSalaryComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SettingSalaryComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/VisibleSalarySettingComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >VisibleSalarySettingComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#pipes-links-module-SettingModule-2bb887d9d41e7806aa65ab59be6ca871ce4af23a981f34b36ca17c51e1048f7e0aa8f849b9650690134fec0a62916bd47c75c4c79fa0387d288cdb7bedda6276"' : 'data-target="#xs-pipes-links-module-SettingModule-2bb887d9d41e7806aa65ab59be6ca871ce4af23a981f34b36ca17c51e1048f7e0aa8f849b9650690134fec0a62916bd47c75c4c79fa0387d288cdb7bedda6276"' }>
                                            <span class="icon ion-md-add"></span>
                                            <span>Pipes</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="pipes-links-module-SettingModule-2bb887d9d41e7806aa65ab59be6ca871ce4af23a981f34b36ca17c51e1048f7e0aa8f849b9650690134fec0a62916bd47c75c4c79fa0387d288cdb7bedda6276"' :
                                            'id="xs-pipes-links-module-SettingModule-2bb887d9d41e7806aa65ab59be6ca871ce4af23a981f34b36ca17c51e1048f7e0aa8f849b9650690134fec0a62916bd47c75c4c79fa0387d288cdb7bedda6276"' }>
                                            <li class="link">
                                                <a href="pipes/BlockSalaryPipe.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BlockSalaryPipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/PriceSettingSalaryPipe.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PriceSettingSalaryPipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/PricesPipe.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PricesPipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/SalaryTypePipe.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SalaryTypePipe</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/SettingRoutingModule.html" data-type="entity-link" >SettingRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/SharedModule.html" data-type="entity-link" >SharedModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-SharedModule-e2792146b041af900bfd2e57b709110bf59fcea5894133bab73ef82fe18a39eca86bbdcec2f54eec63ef0002422222b1202f435d60ffd54c4df95d7d088d4a78"' : 'data-target="#xs-components-links-module-SharedModule-e2792146b041af900bfd2e57b709110bf59fcea5894133bab73ef82fe18a39eca86bbdcec2f54eec63ef0002422222b1202f435d60ffd54c4df95d7d088d4a78"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SharedModule-e2792146b041af900bfd2e57b709110bf59fcea5894133bab73ef82fe18a39eca86bbdcec2f54eec63ef0002422222b1202f435d60ffd54c4df95d7d088d4a78"' :
                                            'id="xs-components-links-module-SharedModule-e2792146b041af900bfd2e57b709110bf59fcea5894133bab73ef82fe18a39eca86bbdcec2f54eec63ef0002422222b1202f435d60ffd54c4df95d7d088d4a78"' }>
                                            <li class="link">
                                                <a href="components/TableSelectPayrollComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TableSelectPayrollComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#components-links"' :
                            'data-target="#xs-components-links"' }>
                            <span class="icon ion-md-cog"></span>
                            <span>Components</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="components-links"' : 'id="xs-components-links"' }>
                            <li class="link">
                                <a href="components/ModalSettingSalaryComponent.html" data-type="entity-link" >ModalSettingSalaryComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SettingSalaryComponent.html" data-type="entity-link" >SettingSalaryComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/VisibleSalarySettingComponent.html" data-type="entity-link" >VisibleSalarySettingComponent</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/SalaryService.html" data-type="entity-link" >SalaryService</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AbsentSalaryService.html" data-type="entity-link" >AbsentSalaryService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AllowanceBranchService.html" data-type="entity-link" >AllowanceBranchService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AllowanceSalaryService.html" data-type="entity-link" >AllowanceSalaryService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AppQuery.html" data-type="entity-link" >AppQuery</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AppStore.html" data-type="entity-link" >AppStore</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/BlockSettingSalaryService.html" data-type="entity-link" >BlockSettingSalaryService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ContractEffect.html" data-type="entity-link" >ContractEffect</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ContractQuery.html" data-type="entity-link" >ContractQuery</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ContractService.html" data-type="entity-link" >ContractService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ContractStore.html" data-type="entity-link" >ContractStore</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DayOffSalaryService.html" data-type="entity-link" >DayOffSalaryService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DeductionSalaryService.html" data-type="entity-link" >DeductionSalaryService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/OvertimeSalaryService.html" data-type="entity-link" >OvertimeSalaryService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/OverviewService.html" data-type="entity-link" >OverviewService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PayrollEffect.html" data-type="entity-link" >PayrollEffect</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PayrollQuery.html" data-type="entity-link" >PayrollQuery</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PayrollService.html" data-type="entity-link" >PayrollService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PayrollStore.html" data-type="entity-link" >PayrollStore</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PayslipService.html" data-type="entity-link" >PayslipService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RankEffect.html" data-type="entity-link" >RankEffect</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RankQuery.html" data-type="entity-link" >RankQuery</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RankService.html" data-type="entity-link" >RankService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RankStore.html" data-type="entity-link" >RankStore</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SalaryEffect.html" data-type="entity-link" >SalaryEffect</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SalaryHolidayService.html" data-type="entity-link" >SalaryHolidayService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SalaryPermanentService.html" data-type="entity-link" >SalaryPermanentService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SalaryQuery.html" data-type="entity-link" >SalaryQuery</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SalaryRemoteService.html" data-type="entity-link" >SalaryRemoteService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SalarySettingService.html" data-type="entity-link" >SalarySettingService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SalaryStore.html" data-type="entity-link" >SalaryStore</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SettingBonusEffect.html" data-type="entity-link" >SettingBonusEffect</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SettingBonusQuery.html" data-type="entity-link" >SettingBonusQuery</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SettingBonusService.html" data-type="entity-link" >SettingBonusService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SettingBonusStore.html" data-type="entity-link" >SettingBonusStore</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SettingRankEffect.html" data-type="entity-link" >SettingRankEffect</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SettingRankQuery.html" data-type="entity-link" >SettingRankQuery</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SettingRankService.html" data-type="entity-link" >SettingRankService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SettingRankStore.html" data-type="entity-link" >SettingRankStore</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SettingSalaryEffect.html" data-type="entity-link" >SettingSalaryEffect</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SettingSalaryQuery.html" data-type="entity-link" >SettingSalaryQuery</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SettingSalaryStore.html" data-type="entity-link" >SettingSalaryStore</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#guards-links"' :
                            'data-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/RouteGuard.html" data-type="entity-link" >RouteGuard</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/AbsentSalaryEntity.html" data-type="entity-link" >AbsentSalaryEntity</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AllowanceBranchEntity.html" data-type="entity-link" >AllowanceBranchEntity</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AllowanceSalaryEntity.html" data-type="entity-link" >AllowanceSalaryEntity</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AppState.html" data-type="entity-link" >AppState</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BaseAddAbsentSalaryDto.html" data-type="entity-link" >BaseAddAbsentSalaryDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BaseAddAllowanceBranchDto.html" data-type="entity-link" >BaseAddAllowanceBranchDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BaseAddAllowanceSalaryDto.html" data-type="entity-link" >BaseAddAllowanceSalaryDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BaseAddManyPayrollDto.html" data-type="entity-link" >BaseAddManyPayrollDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BaseAddManySalaryDto.html" data-type="entity-link" >BaseAddManySalaryDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BaseAddOvertimeSalaryDto.html" data-type="entity-link" >BaseAddOvertimeSalaryDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BaseAddPayrollDto.html" data-type="entity-link" >BaseAddPayrollDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BaseAddPermanentSalaryDto.html" data-type="entity-link" >BaseAddPermanentSalaryDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BaseAddRankDto.html" data-type="entity-link" >BaseAddRankDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BaseAddSalarySettingDto.html" data-type="entity-link" >BaseAddSalarySettingDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BaseAddSettingBonusDto.html" data-type="entity-link" >BaseAddSettingBonusDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BaseAddSettingRankDto.html" data-type="entity-link" >BaseAddSettingRankDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BaseAllowanceBranchEntity.html" data-type="entity-link" >BaseAllowanceBranchEntity</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BaseContractEntity.html" data-type="entity-link" >BaseContractEntity</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BaseModalSalaryData.html" data-type="entity-link" >BaseModalSalaryData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BasePayrollEntity.html" data-type="entity-link" >BasePayrollEntity</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BaseRankEntity.html" data-type="entity-link" >BaseRankEntity</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BaseSalaryEntity.html" data-type="entity-link" >BaseSalaryEntity</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BaseSalarySettingEntity.html" data-type="entity-link" >BaseSalarySettingEntity</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BaseSearchPayrollDto.html" data-type="entity-link" >BaseSearchPayrollDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BaseSearchRankDto.html" data-type="entity-link" >BaseSearchRankDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BaseSearchSalarySettingDto.html" data-type="entity-link" >BaseSearchSalarySettingDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BaseSearchSettingBonusDto.html" data-type="entity-link" >BaseSearchSettingBonusDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BaseSearchSettingRankDto.html" data-type="entity-link" >BaseSearchSettingRankDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BaseSettingBonusEntity.html" data-type="entity-link" >BaseSettingBonusEntity</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BaseSettingRankEntity.html" data-type="entity-link" >BaseSettingRankEntity</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BaseUpdateAbsentDto.html" data-type="entity-link" >BaseUpdateAbsentDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BaseUpdateAllowanceBranchDto.html" data-type="entity-link" >BaseUpdateAllowanceBranchDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BaseUpdateAllowanceDto.html" data-type="entity-link" >BaseUpdateAllowanceDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BaseUpdateManySalaryDto.html" data-type="entity-link" >BaseUpdateManySalaryDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BaseUpdateOvertimeDto.html" data-type="entity-link" >BaseUpdateOvertimeDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BaseUpdatePayrollDto.html" data-type="entity-link" >BaseUpdatePayrollDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BaseUpdatePermanentDto.html" data-type="entity-link" >BaseUpdatePermanentDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BaseUpdateRankDto.html" data-type="entity-link" >BaseUpdateRankDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BaseUpdateSalarySettingDto.html" data-type="entity-link" >BaseUpdateSalarySettingDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BaseUpdateSettingBonusDto.html" data-type="entity-link" >BaseUpdateSettingBonusDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BaseUpdateSettingRankDto.html" data-type="entity-link" >BaseUpdateSettingRankDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BlockSalary.html" data-type="entity-link" >BlockSalary</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BlockSettingSalaryEntity.html" data-type="entity-link" >BlockSettingSalaryEntity</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ConfirmPayrollDto.html" data-type="entity-link" >ConfirmPayrollDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ContractEntity.html" data-type="entity-link" >ContractEntity</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ContractState.html" data-type="entity-link" >ContractState</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DayOffSalaryEntity.html" data-type="entity-link" >DayOffSalaryEntity</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DeductionSalaryEntity.html" data-type="entity-link" >DeductionSalaryEntity</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/HolidaySalaryEntity.html" data-type="entity-link" >HolidaySalaryEntity</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ModalAbsentOrOvertimeSalaryData.html" data-type="entity-link" >ModalAbsentOrOvertimeSalaryData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ModalAddSalary.html" data-type="entity-link" >ModalAddSalary</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ModalAllowanceBranchData.html" data-type="entity-link" >ModalAllowanceBranchData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ModalAllowanceSalaryData.html" data-type="entity-link" >ModalAllowanceSalaryData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ModalBranchData.html" data-type="entity-link" >ModalBranchData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ModalDegreeData.html" data-type="entity-link" >ModalDegreeData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ModalDepartmentData.html" data-type="entity-link" >ModalDepartmentData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ModalEmployee.html" data-type="entity-link" >ModalEmployee</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ModalPermanentSalaryData.html" data-type="entity-link" >ModalPermanentSalaryData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ModalPositionData.html" data-type="entity-link" >ModalPositionData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ModalRelative.html" data-type="entity-link" >ModalRelative</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ModalRemoteOrDayOffSalaryData.html" data-type="entity-link" >ModalRemoteOrDayOffSalaryData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ModalSettingSalaryData.html" data-type="entity-link" >ModalSettingSalaryData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ModalUpdateSalary.html" data-type="entity-link" >ModalUpdateSalary</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/OvertimeSalaryEntity.html" data-type="entity-link" >OvertimeSalaryEntity</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PayrollEntity.html" data-type="entity-link" >PayrollEntity</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PayrollEntityState.html" data-type="entity-link" >PayrollEntityState</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PayslipEntity.html" data-type="entity-link" >PayslipEntity</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PermanentSalaryEntity.html" data-type="entity-link" >PermanentSalaryEntity</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RankEntity.html" data-type="entity-link" >RankEntity</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RankState.html" data-type="entity-link" >RankState</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/recipeType.html" data-type="entity-link" >recipeType</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RemoteSalaryEntity.html" data-type="entity-link" >RemoteSalaryEntity</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RemoveSalaryDto.html" data-type="entity-link" >RemoveSalaryDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Salary.html" data-type="entity-link" >Salary</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SalaryConstraintEntity.html" data-type="entity-link" >SalaryConstraintEntity</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SalaryEntity.html" data-type="entity-link" >SalaryEntity</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SalarySettingEntity.html" data-type="entity-link" >SalarySettingEntity</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SalaryState.html" data-type="entity-link" >SalaryState</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SessionEntity.html" data-type="entity-link" >SessionEntity</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SettingBonusEntity.html" data-type="entity-link" >SettingBonusEntity</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SettingBonusState.html" data-type="entity-link" >SettingBonusState</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SettingRankEntity.html" data-type="entity-link" >SettingRankEntity</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SettingRankState.html" data-type="entity-link" >SettingRankState</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SettingSalaryState.html" data-type="entity-link" >SettingSalaryState</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SettingSalaryVisibleEntity.html" data-type="entity-link" >SettingSalaryVisibleEntity</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Timesheet.html" data-type="entity-link" >Timesheet</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TotalSalary.html" data-type="entity-link" >TotalSalary</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/visible.html" data-type="entity-link" >visible</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/WorkHoliday.html" data-type="entity-link" >WorkHoliday</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#pipes-links"' :
                                'data-target="#xs-pipes-links"' }>
                                <span class="icon ion-md-add"></span>
                                <span>Pipes</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="pipes-links"' : 'id="xs-pipes-links"' }>
                                <li class="link">
                                    <a href="pipes/BlockSalaryPipe.html" data-type="entity-link" >BlockSalaryPipe</a>
                                </li>
                                <li class="link">
                                    <a href="pipes/FilterPipe.html" data-type="entity-link" >FilterPipe</a>
                                </li>
                                <li class="link">
                                    <a href="pipes/PartialdayPipe.html" data-type="entity-link" >PartialdayPipe</a>
                                </li>
                                <li class="link">
                                    <a href="pipes/RangeDateTimePipe.html" data-type="entity-link" >RangeDateTimePipe</a>
                                </li>
                                <li class="link">
                                    <a href="pipes/TransformSalaryTypePipe.html" data-type="entity-link" >TransformSalaryTypePipe</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
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
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});