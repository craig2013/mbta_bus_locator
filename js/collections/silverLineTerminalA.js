var app = app || {};

(function() {
    app.collections.silverLineTerminalA =     
    {
        attributes: {
            copyright: "All data copyright MBTA 2015."
        },
        predictions: [
            {
                attributes: {
                    agencyTitle: "MBTA",
                    routeTitle: "Silver Line SL1",
                    routeTag: "741",
                    stopTitle: "Terminal A",
                    stopTag: "17091"
                },
                direction: {
                    attributes: {
                        title: "South Station"
                    },
                    prediction: [
                        {
                            attributes: {
                                epochTime: "1432151491854",
                                seconds: "342",
                                minutes: "5",
                                isDeparture: "false",
                                dirTag: "741_1_var0",
                                vehicle: "1123",
                                block: "S741_81",
                                tripTag: "26207269"
                            }
                        },
                        {
                            attributes: {
                                epochTime: "1432151929541",
                                seconds: "779",
                                minutes: "12",
                                isDeparture: "false",
                                dirTag: "741_1_var0",
                                vehicle: "1127",
                                block: "S741_77",
                                tripTag: "26207285"
                            }
                        },
                        {
                            attributes: {
                                epochTime: "1432154269865",
                                seconds: "3120",
                                minutes: "52",
                                isDeparture: "false",
                                affectedByLayover: "true",
                                dirTag: "741_1_var0",
                                vehicle: "1129",
                                block: "S741_78",
                                tripTag: "26207233"
                            }
                        },
                        {
                            attributes: {
                                epochTime: "1432155469865",
                                seconds: "4320",
                                minutes: "72",
                                isDeparture: "false",
                                affectedByLayover: "true",
                                dirTag: "741_1_var0",
                                vehicle: "1123",
                                block: "S741_81",
                                tripTag: "26207268"
                            }
                        },
                        {
                            attributes: {
                                epochTime: "1432156069865",
                                seconds: "4920",
                                minutes: "82",
                                isDeparture: "false",
                                affectedByLayover: "true",
                                dirTag: "741_1_var0",
                                vehicle: "1127",
                                block: "S741_77",
                                tripTag: "26207284"
                            }
                        }
                    ]
                }
            },
            {
                attributes: {
                    agencyTitle: "MBTA",
                    routeTitle: "171",
                    routeTag: "171",
                    stopTitle: "Terminal A",
                    stopTag: "17091",
                    dirTitleBecauseNoPredictions: "Logan Airport via Andrew"
                }
            }
        ]
    };    
})();

