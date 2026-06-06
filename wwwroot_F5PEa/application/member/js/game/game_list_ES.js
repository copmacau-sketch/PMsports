 function game_list_ES(_win, _dom, _post) {
                var _self = this;
                var classname = "game_list_ES";
                var gameInfo = new Object;
                newESTabAry = new Array("lol","dota","cs","kog","val","wr","ml","star2","pubg","aov","ove","rs","rl","star","war","cro","cod","ff","aoe","aoe2","pu","al","others");
                gameInfo["rb"] = new Array("ECID","DATETIME","MIDFIELD_SHOW","PTYPE","RB_SHOW","RBICON_SHOW","SCORE_H","SCORE_C","TEAM_H","TEAM_C","DISPLAY_TV","TV_STYLE","MORE","STRONG_H","STRONG_C","LASTESTSCORE_H","LASTESTSCORE_C","INFO_SHOW","RETIMESET","PERIOD","BEST","SCORETYPE","PARENT_ID","NOWGAME","TYPE","COLOR_H","COLOR_C","START_H","START_C","MATCH_H","MATCH_C","GAME_H","GAME_C","NOWGAME_DIS");
                gameInfo["r"] = new Array("ECID","DATETIME","MIDFIELD_SHOW","PTYPE","RB_SHOW","RBICON_SHOW","SCORE_H","SCORE_C","TEAM_H","TEAM_C","DISPLAY_TV","TV_STYLE","MORE","STRONG_H","STRONG_C","LASTESTSCORE_H","LASTESTSCORE_C","INFO_SHOW","PERIOD","BEST","SCORETYPE","PARENT_ID","TYPE","COLOR_H","COLOR_C","START_H","START_C","START_GAME");
                var GameRatio = new Object;
                GameRatio["rb"] = new Array("ECID","GID","GIDM","HGID","DIS_PERIOD","STR_MS","PLAYS");
                GameRatio["r"] = new Array("ECID","GID","GIDM","HGID","DIS_PERIOD","STR_MS","PLAYS");
                var IOR_rb = new Object;
                IOR_rb["RM"] = new Array("RMH","RMC","RMN");
                IOR_rb["RE"] = new Array("REH","REC");
                IOR_rb["ROU"] = new Array("ROUH","ROUC");
                IOR_rb["REO"] = new Array("REOO","REOE");
                var IOR_r = new Object;
                IOR_r["R"] = new Array("RH","RC");
                IOR_r["OU"] = new Array("OUH","OUC");
                IOR_r["M"] = new Array("MH","MC","MN");
                IOR_r["EO"] = new Array("EOO","EOE");
                var IOR = new Object;
                IOR["rb"] = IOR_rb;
                for (var m = 0; m < newESTabAry.length; m++)
                    IOR["r" + newESTabAry[m]] = IOR["rb"];
                IOR["r"] = IOR_r;
                for (var n = 0; n < newESTabAry.length; n++)
                    IOR[newESTabAry[n]] = IOR["r"];
                _self.init = function() {
                    _self.reInit(_self, classname, gameInfo, GameRatio, null, null, IOR)
                }
            }
            ;