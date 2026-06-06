function game_list_SK(_win, _dom, _post) {
                var _self = this;
                var classname = "game_list_SK";
                var gameInfo = new Object;
                gameInfo["rb"] = new Array("ECID","DATETIME","MIDFIELD_SHOW","PTYPE","RB_SHOW","RBICON_SHOW","SCORE_H","SCORE_C","TEAM_H","TEAM_C","DISPLAY_TV","TV_STYLE","MORE","STRONG_H","STRONG_C","LASTESTSCORE_H","LASTESTSCORE_C","INFO_SHOW","BEST","BEST_MODE","RETIMESET");
                gameInfo["r"] = new Array("ECID","DATETIME","MIDFIELD_SHOW","PTYPE","RB_SHOW","RBICON_SHOW","SCORE_H","SCORE_C","TEAM_H","TEAM_C","DISPLAY_TV","TV_STYLE","MORE","STRONG_H","STRONG_C","LASTESTSCORE_H","LASTESTSCORE_C","INFO_SHOW","BEST","BEST_MODE");
                var GameRatio = new Object;
                GameRatio["rb"] = new Array("ECID","GID","GIDM","HGID","STR_RF","STR_MS","WTYPE_RF","PLAYS");
                GameRatio["r"] = new Array("ECID","GID","GIDM","HGID","STR_F01","STR_MS","PLAYS");
                var IOR_rb = new Object;
                IOR_rb["RM"] = new Array("RMH","RMC");
                IOR_rb["RE"] = new Array("REH","REC");
                IOR_rb["ROU"] = new Array("ROUH","ROUC");
                IOR_rb["RF"] = new Array("RFH","RFC");
                var IOR_r = new Object;
                IOR_r["R"] = new Array("RH","RC");
                IOR_r["OU"] = new Array("OUH","OUC");
                IOR_r["M"] = new Array("MH","MC");
                IOR_r["F01"] = new Array("F01H","F01C");
                var IOR = new Object;
                IOR["rb"] = IOR_rb;
                IOR["r"] = IOR_r;
                _self.init = function() {
                    _self.reInit(_self, classname, gameInfo, GameRatio, null, null, IOR)
                }
            }
            ;