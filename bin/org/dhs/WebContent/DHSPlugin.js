require([
        "dojo/_base/lang",
        "dHSPluginDojo/widget/dialog/CaregiverDialog",
        "dHSPluginDojo/widget/dialog/ServiceIdDialog",
        "dHSPluginDojo/widget/dialog/ClientDialog",
        "dHSPluginDojo/widget/dialog/IncomeMaintananceDialog",
        "ecm/widget/dialog/MessageDialog",
        "dHSPluginDojo/widget/dialog/DCAddPropertiesDialog",
        "ecm/widget/LoginPane",
        "dojo/aspect",
        "dojo/query",
        "dojo/dom-construct",
        "dojo/dom-style",
        "pvr/widget/_Property",
        "ecm/model/Request",
        "ecm/widget/dialog/MessageDialog",
        "ecm/model/Desktop"
    ],
    function(lang, CaregiverDialog, ServiceIdDialog, ClientDialog, IncomeMaintanance, MessageDialog, DCAddPropertiesDialog, LoginPane, aspect, query, domConstruct, domStyle, _Property, Request, MessageDialog, Desktop) {

        lang.setObject("prefillAction", function(repository, items, callback, teamspace, resultSet, parameterMap) {

            var actionName = "";
            try {
                actionName = window.batch.container.controller.collections.DC_Page.model.properties.Content_Type.value;
                console.log("actionName" + actionName);
            } catch (e) {}

            switch (actionName) {

                case "CCL – Care Giver Docs":
                    var dialog = new CaregiverDialog();
                    dialog.show();
                    break;
                case "Income Maintenance":
                    var dialog = new IncomeMaintanance();
                    dialog.show();
                    break;
                case "CCL - Service Docs":
                    var dialog = new ServiceIdDialog();
                    dialog.show();
                    break;

                case (actionName.match(/^Client/) || {}).input:
                    var dialog = new ClientDialog();
                    dialog.show();
                    break;

                default:
                    var message = new MessageDialog({
                        text: 'Invalid content type selection / Prefill is not available'
                    });
                    message.show();
                    break;
            }
        });

        aspect.after(LoginPane.prototype, "_initializeForDesktop", lang.hitch(this, function() {
            setTimeout(lang.hitch(this, function() {
                var loginPage = query(".ecmLoginPane");
                if (loginPage.length > 0) {
                    domStyle.set(loginPage[0], {
                        backgroundImage: "url('plugin/DHSPlugin/getResource/images/hawaii.jpg')",
                        backgroundSize: "cover"
                    });
                }
            }), 800);

            setTimeout(lang.hitch(this, function() {
                var element = query(".loginBorder");
                if (element && element.length > 0) {
                    domConstruct.create("div", {
                        innerHTML: "<p class='legal_name'>**DHS WARNING MESSAGE**</p><p class='legal_message'>This system contains State and Federal government information that is restricted to authorized users ONLY. By accessing and using this computer system, you are consenting to system monitoring for law enforcement and other purposes. Therefore, no expectation of privacy is to be assumed. Unauthorized use of or access to, misuse or modification of this computer system or of the data contained herein or in transit to/from this system constitutes a violation and may subject you to State and Federal criminal prosecution and penalties as well as civil penalties. This includes criminal and civil penalties pursuan to Title 26, United States Code Section 7213, 7213A (the Taxpayer Browsing Protection Act), and 7431 If you are not authorized to access this system, please disconnect or exit the system now</p>"
                    }, element[0], "after");
                } // element end

            }), 800);

        }));

        // property edit changes fetcher
        aspect.after(_Property.prototype, "_onEditorInput", lang.hitch(this, function(change) {
            // get the content type
            console.log(change)
            var contentType = window.batch.container.controller.collections.DC_Page.model.properties.Content_Type.value;
            if (contentType != "" && contentType != undefined) {
                switch (contentType) {
                    case "CCL – Care Giver Docs":
                        var caregiverId = window.batch.container.controller.collections.DC_Page.model.properties.CaregiverID.value;
                        if (caregiverId != "" && caregiverId != undefined && change.value) {
                            var requestParams = {};
                            requestParams['lastName'] = "";
                            requestParams['ssn'] = "";
                            requestParams['dateOfBirth'] = "";
                            requestParams['gender'] = "";
                            requestParams['firstName'] = "";
                            requestParams['caregiverID'] = caregiverId;
                            invokeAPICall("LookupCaregiver", requestParams, lang.hitch(this, function(data) {
                                if (data.error == null && data.status === "success") {
                                    var _data = data.results.rows[0];
                                    if (Object.keys(_data).length === 0) {
                                        setPropertyValue("CaregiverID", "")
                                        setPropertyValue("Last_Name", "")
                                        setPropertyValue("First_Name", "")
                                        setPropertyValue("Gender", "")
                                        setPropertyValue("SSN", "")
                                        setPropertyValue("Date_Of_Birth", "")
                                        var message = new MessageDialog({
                                            text: 'No Records available'
                                        });
                                        message.show();
                                    } else {
                                        var dateOfBirth = _data.dateOfBirth
                                        var gender = _data.gender;
                                        if (dateOfBirth) {
                                            var _f = new Date(dateOfBirth)
                                            dateOfBirth = ((_f.getMonth() + 1) < 10 ? "0" + (_f.getMonth() + 1) : (_f.getMonth() + 1)) + "/" + (_f.getDate() < 10 ? ("0" + _f.getDate()) : _f.getDate()) + "/" + _f.getFullYear()
                                        }
                                        setPropertyValue("CaregiverID", _data.caregiverID)
                                        setPropertyValue("Last_Name", _data.lastName)
                                        setPropertyValue("First_Name", _data.firstName)
                                        setPropertyValue("Gender", gender === "M" ? "Male" : "Female")
                                        setPropertyValue("SSN", _data.ssn)
                                        setPropertyValue("Date_Of_Birth", dateOfBirth)
                                    }
                                } else {
                                    var message = new MessageDialog({
                                        text: 'An error while fetching details'
                                    });
                                    message.show();
                                }
                            }));
                        }
                        break;
                    case (contentType.match(/^Client/) || {}).input:
                        var clientId = window.batch.container.controller.collections.DC_Page.model.properties.Client_ID.value;
                        if (clientId != "" && clientId != undefined && change.value) {
                            var requestParams = {};
                            requestParams['lastName'] = "";
                            requestParams['ssn'] = "";
                            requestParams['dateOfBirth'] = "";
                            requestParams['gender'] = "";
                            requestParams['firstName'] = "";
                            requestParams['clientNumber'] = clientId;
                            invokeAPICall("LookupClient", requestParams, lang.hitch(this, function(data) {
                                if (data.error == null && data.status === "success") {
                                    var _data = data.results.rows[0];
                                    if (Object.keys(_data).length === 0) {
                                        setPropertyValue("Client_ID", "")
                                        setPropertyValue("Last_Name", "")
                                        setPropertyValue("First_Name", "")
                                        setPropertyValue("SSN", "")
                                        setPropertyValue("Date_Of_Birth", "")
                                        var message = new MessageDialog({
                                            text: 'No Records available'
                                        });
                                        message.show();
                                    } else {
                                        var dateOfBirth = _data.dateOfBirth
                                        if (dateOfBirth) {
                                            var _f = new Date(dateOfBirth)
                                            dateOfBirth = ((_f.getMonth() + 1) < 10 ? "0" + (_f.getMonth() + 1) : (_f.getMonth() + 1)) + "/" + (_f.getDate() < 10 ? ("0" + _f.getDate()) : _f.getDate()) + "/" + _f.getFullYear()
                                        }
                                        setPropertyValue("Client_ID", _data.clientNumber)
                                        setPropertyValue("Last_Name", _data.lastName)
                                        setPropertyValue("First_Name", _data.firstName)
                                        setPropertyValue("SSN", _data.ssn)
                                        setPropertyValue("Date_Of_Birth", dateOfBirth)
                                    }
                                } else {
                                    var message = new MessageDialog({
                                        text: 'An error while fetching details'
                                    });
                                    message.show();
                                }
                            }));
                        }
                        break;
                    case "CCL - Service Docs":
                        var serviceId = window.batch.container.controller.collections.DC_Page.model.properties.ServiceID.value
                        if (serviceId != "" && serviceId != undefined && change.value) {
                            var requestParams = {};
                            requestParams['serviceID'] = serviceId;
                            requestParams['nameSearchType'] = "";
                            requestParams['keywords'] = "";
                            requestParams['serviceTypeCode'] = "";
                            requestParams['tin'] = "";
                            invokeAPICall("LookupServiceId", requestParams, lang.hitch(this, function(data) {
                                if (data.error == null && data.status === "success") {
                                    var _data = data.results.rows[0];
                                    if (Object.keys(_data).length === 0) {
                                        setPropertyValue("ServiceID", "")
                                        setPropertyValue("ServiceName", "")
                                        setPropertyValue("ServiceStatus", "")
                                        setPropertyValue("ProviderName", "")
                                        setPropertyValue("ProviderID", "")
                                        setPropertyValue("ProviderTIN", "")
                                        var message = new MessageDialog({
                                            text: 'No Records available'
                                        });
                                        message.show();
                                    } else {
                                        setPropertyValue("ServiceID", _data.serviceID)
                                        setPropertyValue("ServiceName", _data.serviceName)
                                        setPropertyValue("ServiceStatus", _data.status)
                                        setPropertyValue("ProviderName", _data.providerName)
                                        setPropertyValue("ProviderID", _data.providerID)
                                        setPropertyValue("ProviderTIN", _data.providerTIN)
                                    }
                                } else {
                                    var message = new MessageDialog({
                                        text: 'An error while fetching details'
                                    });
                                    message.show();
                                }
                            }));
                        }
                        break;

                    case "Income Maintenance":
                        var clientNumber = window.batch.container.controller.collections.DC_Page.model.properties.Client_ID.value;
                        var properties = window.batch.container.controller.collections.DC_Page.model.properties;
                        var caseNumber = "";
                        Object.entries(properties).forEach(function(property) {
							//console.log(property)
							if(property[0] === "Case Number") {
								caseNumber =  property[1].value;
							}
						})
                        //console.log(caseNumber);
						var requestParams = {};
                        requestParams['clientNumber'] = clientNumber;
                        requestParams['caseNumber'] = caseNumber;
						var emptyClient = (clientNumber === "" || clientNumber === null);
						var emptyCaseNumber = (caseNumber === "" || caseNumber === null);
						//console.log('emptyClient :'+emptyClient +" and emptyCaseNumber :"+emptyCaseNumber);
						var bothEmpty = emptyClient && emptyCaseNumber;
						var bothFilled = !emptyClient && !emptyCaseNumber;
                       // console.log(bothEmpty + " and "+ bothFilled);
						//console.dir("condition :"+(!bothEmpty && !bothFilled));
						if (!bothEmpty && !bothFilled) {
                            invokeAPICall("LookupIncomeMaintenance", requestParams, lang.hitch(this, function(data) {
                                if (data.error == null && data.status === "success") {
                                    var _data = data.results.rows[0];
                                    if (Object.keys(_data).length === 0) {
                                        setPropertyValue("First_Name", "")
                                        setPropertyValue("Last_Name", "")
                                        setPropertyValue("Gender", "")
                                        setPropertyValue("SSN", "")
                                        setPropertyValue("Date_Of_Birth", "")
                                        setPropertyValue("Case Number", "")
                                        setPropertyValue("Client_ID", "")
                                        var message = new MessageDialog({
                                            text: 'No Records available'
                                        });
                                        message.show();
                                    } else {
                                        var gender = _data.gender;
                                        var dateOfBirth = _data.dateOfBirth
                                        if (dateOfBirth) {
                                            var _f = new Date(dateOfBirth)
                                            dateOfBirth = ((_f.getMonth() + 1) < 10 ? "0" + (_f.getMonth() + 1) : (_f.getMonth() + 1)) + "/" + (_f.getDate() < 10 ? ("0" + _f.getDate()) : _f.getDate()) + "/" + _f.getFullYear()
                                        }
                                        var cn = _data.caseNumber;
                                        if (cn === undefined || cn === "") {
                                            cn = caseNumber;
                                        }
                                        setPropertyValue("First_Name", _data.firstName)
                                        setPropertyValue("Last_Name", _data.lastName)
                                        setPropertyValue("Gender", gender)
                                        setPropertyValue("SSN", _data.ssn)
                                        setPropertyValue("Date_Of_Birth", _data.dateOfBirth)
                                        setPropertyValue("Case Number", cn)
                                        setPropertyValue("Client_ID", _data.clientNumber)
                                    }
                                } else {
                                    var message = new MessageDialog({
                                        text: 'An error while fetching details'
                                    });
                                    message.show();
                                }
                            }));

                            break;
                        }

                }
            }
        }), true)


        function invokeAPICall(serviceName, params, callback) {
            Request.invokePluginService("DHSPlugin", serviceName, {
                requestParams: params,
                requestCompleteCallback: lang.hitch(this, function(data) {
                    callback(data)
                }),
                requestFailedCallback: lang.hitch(this, function(data) {
                    callback(data)
                })
            });
        }

        function setPropertyValue(name, value) {
            window.batch.container.controller.getPropertyController("DC_Batch", name).set("value", value);
        }


        aspect.after(Desktop, "onDesktopLoaded", lang.hitch(this, function() {
            require(["datacap/model/Util", "datacapweb/client/BatchTreeViewEx"], function(Util, BatchTreeViewEx) {
                lang.extend(BatchTreeViewEx, {

                    templateString: "<div class=\"dcPanel dcBatchTree\"> <div data-dojo-type=\"idx\/layout\/TitlePane\" data-dojo-attach-point=\"batchViewTitlePane\" data-dojo-props=\"collapsible: false, style: 'width: 100%; height: 100%; margin-top: 0px; margin-left: 0px; margin-bottom: 0px; margin-right: 0px;'\" tabIndex=\"-1\"> <div data-dojo-type=\"dijit\/Toolbar\" data-dojo-props=\"style: 'height: 25px;padding-bottom:3px;'\" data-dojo-attach-point=\"batchTreeViewToolbar\" aria-label=\"${_messages.batch_tree_title}\"> <div data-dojo-type=\"dijit.form.Button\" data-dojo-attach-point=\"gridExpandImg\" data-dojo-props=\"iconClass:'batchTreeViewEx colaspeTreeGridx', showLabel:false, label:'${_messages.expandLabel} ${expandAllHotkeyLabel}'\" data-dojo-attach-event=\"onClick:expandTreeGrid\"><\/div> <div data-dojo-type=\"dijit.form.Button\" data-dojo-attach-point=\"moveUpDocumentImg\" data-dojo-props=\"iconClass:'batchTreeViewEx upEx', showLabel:false, label:'${_messages.moveUpLabel} ${moveUpHotkeyLabel}'\" data-dojo-attach-event=\"onClick:moveUp\"><\/div> <div data-dojo-type=\"dijit.form.Button\" data-dojo-attach-point=\"moveDownDocumentImg\" data-dojo-props=\"iconClass:'batchTreeViewEx downEx', showLabel:false, label:'${_messages.moveDownLabel} ${moveDownHotkeyLabel}'\" data-dojo-attach-event=\"onClick:moveDown\"><\/div> <div data-dojo-type=\"dijit.form.Button\" data-dojo-attach-point=\"deleteAllImg\" data-dojo-props=\"iconClass:'batchTreeViewEx removeAllEx', showLabel:false, label:'${_messages.deleteAllLabel} ${removeAllPagesHotkeyLabel}'\" data-dojo-attach-event=\"onClick:removeAll\"><\/div> <div data-dojo-type=\"dijit.form.Button\" data-dojo-attach-point=\"undoBtn\" data-dojo-props=\"iconClass:'rotate90c', showLabel:false, label:'${_messages.undoLabel} ${undoHotkeyLabel}'\" data-dojo-attach-event=\"onClick:undoActions\"><\/div> <div data-dojo-attach-point=\"ActionBtn\" class=\"actionBtn dcRight\" style=\"display:none;\"  data-dojo-attach-event=\"onClick:clickActions\"  data-dojo-type=\"dijit\/form\/DropDownButton\"> <span>${_messages.Actions}<\/span> <span data-dojo-attach-point=\"contextM\" data-dojo-type=\"dijit\/Menu\"> <div data-dojo-type=\"dijit\/MenuItem\" data-dojo-attach-point=\"removeImg\"  data-dojo-attach-event=\"onClick:removePage\" aria-label=\"${_messages.removePageLabel}\"><span class=\"actionMenu\">${_messages.removePageLabel}<\/span><span class=\"menuHotkey\">${deletePageHotkeyLabel}<\/span> <\/div> <div data-dojo-type=\"dijit\/MenuItem\" data-dojo-attach-point=\"copyPageImg\"  data-dojo-attach-event=\"onClick:copyPastePage\" aria-label=\"${_messages.copyPageLable}\"><span class=\"actionMenu\">${_messages.copyPageLable}<\/span><span class=\"menuHotkey\">${copyHotkeyLabel}<\/span><\/div> <div data-dojo-type=\"dijit\/MenuItem\" data-dojo-attach-point=\"splitDocumentImg\"  data-dojo-attach-event=\"onClick:splitDocument\" aria-label=\"${_messages.splitLabel}\"><span class=\"actionMenu\">${_messages.splitLabel}<\/span><span class=\"menuHotkey\">${splitHotkeyLabel}<\/span><\/div> <div data-dojo-type=\"dijit\/MenuItem\" data-dojo-attach-point=\"joinDocumentImg\" data-dojo-attach-event=\"onClick:joinDocument\" aria-label=\"${_messages.joinLabel}\"><span class=\"actionMenu\">${_messages.joinLabel}<\/span><span class=\"menuHotkey\">${mergeHotkeyLabel}<\/span><\/div> <div data-dojo-type=\"dijit\/MenuItem\" data-dojo-attach-point=\"disassembleDocumentBtn\" data-dojo-attach-event=\"onClick:disassembleDocument\" aria-label=\"${_messages.disassembleLabel}\"><span class=\"actionMenu\">${_messages.disassembleLabel}<\/span><span class=\"menuHotkey\">${disassembleHotkeyLabel}<\/span><\/div> <div data-dojo-type=\"dijit\/MenuItem\" data-dojo-attach-point=\"checkIntegrityBtn\"  data-dojo-attach-event=\"onClick:checkIntegrity\" aria-label=\"${_messages.checkIntegrityLabel}\"><span class=\"actionMenu\">${_messages.checkIntegrityLabel}<\/span><span class=\"menuHotkey\">${checkIntegrityHotkeyLabel}<\/span><\/div> <div data-dojo-type=\"dijit\/MenuItem\" data-dojo-attach-point=\"deleteDocumentImg\"  data-dojo-attach-event=\"onClick:deleteDocument\" aria-label=\"${_messages.markDeleteLabel}\"><span class=\"actionMenu\">${_messages.markDeleteLabel}<\/span><span class=\"menuHotkey\">${markDeleteHotkeyLabel}<\/span><\/div> <div data-dojo-type=\"dijit\/MenuItem\" data-dojo-attach-point=\"markRescan\"  data-dojo-attach-event=\"onClick:clickMarkForRescan\" aria-label=\"${_messages.markRescanLabel}\"><span class=\"actionMenu\">${_messages.markRescanLabel}<\/span><span class=\"menuHotkey\">${markRescanHotkeyLabel}<\/span><\/div> <div data-dojo-type=\"dijit\/MenuItem\" data-dojo-attach-point=\"markReview\"  data-dojo-attach-event=\"onClick:clickMarkForReview\" aria-label=\"${_messages.markReviewLabel}\"><span class=\"actionMenu\">${_messages.markReviewLabel}<\/span><span class=\"menuHotkey\">${markReviewHotkeyLabel}<\/span><\/div> <div data-dojo-type=\"dijit\/MenuItem\" data-dojo-attach-point=\"addComment\"  data-dojo-attach-event=\"onClick:clickAddComment\" aria-label=\"${_messages.addCommentLabel}\"><span class=\"actionMenu\">${_messages.addCommentLabel}<\/span><span class=\"menuHotkey\">${commentHotkeyLabel}<\/span><\/div> <div data-dojo-type=\"dijit\/MenuItem\" data-dojo-attach-point=\"addProperties\"  data-dojo-attach-event=\"onClick:clickAddProperties\" aria-label=\"${_messages.addCommentLabel}\"><span class=\"actionMenu\">Add Properties<\/span><span class=\"menuHotkey\">${commentHotkeyLabel}<\/span><\/div> <\/span> <\/div> <\/div> <div data-dojo-attach-point=\"treeGridContainer\" class=\"compact gridxWholeRow dc\"  style=\"width: 100%; margin: 0px; padding: 0px;\"> <div id='draggableItems' data-dojo-attach-point=\"treeGridNode\" style=\"width: 100%; Height: 100%;\"><\/div> <\/div> <\/div> <\/div>", // this is new template with extra action

                    clickAddProperties: function() {
                        var pageId = this.grid.select.row.getSelected()[0];
                        var _addPropertiesDialog = new DCAddPropertiesDialog();
                        _addPropertiesDialog.setPageInfo(this._batch, pageId);
                        _addPropertiesDialog.show();
                    }
                })
            })
        }))

    });