# Crown-Gold 管理后台操作手册（详尽版）

> **适用范围（7 个登入身份，分布在 3 个 URL 入口）**：
> - `/admin/` — 服务 **ADS**（超管，admin.level=0）+ **AD**（公司，admin.level=1）两层；登入后服务端按 level 自动写回 `login_layer`。
> - `/d0/` — 仅服务 **D0**（分公司，rank.level=4，又称"登 0"）。
> - `/agents/` — 通过登入 1/2/3 tab 切换服务 **CO**（股东，level=3，"登 1"）、**SU**（总代理，level=2，"登 2"）、**AG**（代理商，level=1，"登 3"）。
>
> **两套独立前端**：`/admin/` + `/d0/` 用经典版 UI（红顶栏 + 8/5 左侧图标 + 在线统计条 + 底部菜单）；`/agents/` 用新版 dashboard UI（红顶 + 操作按钮 + KPI 大字 + 甜甜圈 + `≡` 侧滑），两者代码独立。
>
> **文件依据**：`wwwroot_F5PEa/view/{admin,agents,d0}/`、`wwwroot_F5PEa/static/{admin,agents,d0}/js/`、`vendor/contorller/admin/*.php`、`vendor/lang/zh-cn.php`、`static/admin/js/conf/LS_cn.js`、`vendor/common/Login.php` + `Constant.php`。
> **实测脚本与抓图**：`.notes/probe_admins_v2.py`（Playwright）/ `.notes/login_probe.sh`（curl + SSH 读 PHP session 算验证码）/ `.notes/probe_ui.py`（UI 截图 + 菜单矩阵）/ `.notes/probe_admins_v2.json` / `.notes/probe_ui.json` / `.notes/probe_login_*.png` / `.notes/probe_after_*.png`。
>
> 本手册按"用户登入 → 全局界面 → 各模块 → 每个按钮"层级编排。三套后台的层级差异和登 0/1/2/3 区别详 **§17**。

---

## 0. 用户体系与术语速查

### 0.1 帐号层级（7 层）

源代码权威定义 `vendor/common/Constant.php`：

```php
const ADS = "ads";   // 超管别名 ← /admin/, admin 表 level=0
const AD  = "ad";    // 总后别名 ← /admin/, admin 表 level=1
const D0  = "d0";    // 登0别名  ← /d0/,    rank  表 level=4
const CO  = "co";    // 登1别名  ← /agents/ 登入 1 tab, rank 表 level=3
const SU  = "su";    // 登2别名  ← /agents/ 登入 2 tab, rank 表 level=2
const AG  = "ag";    // 登3别名  ← /agents/ 登入 3 tab, rank 表 level=1
const MEM = "mem";   // 会员       ← H5 前台
const SUB = "sub";   // 子账号    ← 任一主帐号下的辅助员工
```

| 缩写 | 中文 | 角色定位 | 登入入口 | 数据表 | 关键字段 |
|------|------|----------|----------|--------|----------|
| `ADS` | 超管/总公司 | 平台所有者（最顶层） | `/admin/` | `admin` | `level=0` |
| `AD` | 公司 | 平台运营管理者 | `/admin/` | `admin` | `level=1` |
| `D0` | 分公司 | 公司下属一级（"登 0"） | `/d0/` | `rank` | `level=4` |
| `CO` | 股东 / SMA / Corprator | 二级（"登 1"） | `/agents/` 切到登入 1 | `rank` | `level=3` |
| `SU` | 总代理 / Master Agent | 三级（"登 2"） | `/agents/` 切到登入 2 | `rank` | `level=2` |
| `AG` | 代理商 / Agent | 四级（"登 3"） | `/agents/` 切到登入 3 | `rank` | `level=1` |
| `MEM` | 会员 | 终端投注用户 | H5 前台 | `member` | — |
| `Sub` | 子帐号 | 任一主帐号下的员工 | 跟随主帐号 | 同主帐号表 | `isMaster=0` + `pri` |

层级由高到低：`ADS → AD → D0 → CO → SU → AG → MEM`。每个上级只能管理直接下级及更下级。

> **注意**：层级在登入页上叫"**登 0 / 登 1 / 登 2 / 登 3**"是仅 `/agents/` 上有 3 个 tab 显示"登入 1 / 登入 2 / 登入 3"；`/d0/` 自身就是"登 0"但登入页不写。**"登 X"系列不包含 ADS 与 AD**（这两层归 `/admin/`）。

### 0.2 帐户状态
- `Y` **启用**：可登入与下注/操作。
- `N` **停用**：本人无法登入；上级仍可见报表。
- `S` **只能看帐**：可登入但不能新增/修改/下注。
- `F` **禁止登入**：完全封锁；密码错误多次自动转 `F`。

### 0.3 子帐号权限位（`pri_type`）
- `A` 即时注单（含操盘、注单管理）
- `B` 管理帐户（只观看）
- `B1` 管理帐户（更改和观看）
- `B2` 管理帐户（更改额度）
- `C` 报表

只勾 `B` 而无 `B1`/`B2` 时，"快速搜索"、"问题帐号"两入口隐藏。

### 0.4 货币
内核以 **RMB** 记账。支持 `RMB`、`HKD`(0.92)、`USD`(7.17)。会员档案可单独设定币种，新增页右栏显示折算。

### 0.5 球类代码
| 代码 | 名称 | 代码 | 名称 |
|------|------|------|------|
| `ALL` | 所有球类 | `BS` | 棒球 |
| `FT` | 足球 | `SK` | 斯诺克/台球 |
| `BK` | 篮球/美足 | `OP` | 其它 |
| `TN` | 网球 | `FS` | 冠军（Outright） |
| `VB` | 排球 | `SFS` | 特殊冠军 |
| `BM` | 羽毛球 | | |
| `TT` | 乒乓球 | | |

### 0.6 玩法/阶段代码
- 阶段：`LIVE`(滚球) / `TODAY`(初盘) / `EARLY`(早盘) / `STARTED`(已开赛) / `PARLAY`(过关) / `OUTRIGHT`(冠军) / `RESULTS`(赛果)
- 结果：`W` 赢 / `HW` 半赢 / `L` 输 / `HL` 半输 / `T` 退还 / `0` 未结算 / `1` 已结算

---

## 1. 登入与会话

> **三套后台的登入页 UI、字段、参数全不相同**。本节给共同行为；按 layer 的全面差异见 §17。

### 1.1 登入页通用字段
- **登入帐号 `#username`**：4–12 位英文大小写 + 数字，正则 `^[a-zA-Z][A-Za-z0-9_]{0,11}$`。
- **密码 `#pwd`**：至少 2 个字母 + 数字，3 个不同字符，6–12 位，无空格。
- **`记住我的帐号` 复选 `#remember`**：勾选后写 Cookie `ag_userA/B/C=<username>`。
- **登入按钮 `#loginBtn`**：POST `<path>/transform.php?p=login_chk`。

### 1.2 仅 `/admin/` 和 `/d0/` 才有
- **验证码 `#verifycode` + 验证码图 `#verifycode_img`**：算术题（如 `26+26=?`），答案由 PHP Session 保存。点击图片刷新。

### 1.3 仅 `/agents/` 才有
- **登入 tab 三个 `#btn_A` / `#btn_B` / `#btn_C`**：点击切换 `selLayer` + `top.login_layer` + `Safe.style.display`：
  - 登入 1（`btn_A`）→ `co`（股东），显示安全代码。
  - 登入 2（`btn_B`）→ `su`（总代），显示安全代码。
  - 登入 3（`btn_C`）→ `ag`（代理），隐藏安全代码（代理不需此字段）。
- **安全代码 `#pwd_safe`**：仅登 1 / 登 2 可见；登 3 隐藏。
- **`未设定安全代码不需输入` 提示 `#text_msg`**：登 1 / 登 2 显示，登 3 隐藏。
- **语言下拉 `#lang_btn`**：繁体 / 简体 / 英文。
- **忘记密码 `#forgot_pwd`**：进 `pwd_recovery` 流程（需绑邮箱）。

### 1.4 推荐浏览器卡片（三套后台共有）
登入框下方 Chrome / UC / Safari / 火狐 4 个图标 + 链接到 "最低需求" 弹窗。

### 1.5 提交的 POST body（实测）

所有后台共有：`p=login_chk` · `ver=<version>` · `login_layer=<L>` · `username=<U>` · `pwd=<P>` · `langx=<lang>` · `uid=` · `auto=` · `blackbox=` · `userAgent=<base64>`。

差异：
- `/admin/` 提交 `login_layer=ad` + `verifycode=<num>`；服务端根据 `admin.level` 改写为 `ads`（level=0）或 `ad`（level=1）。
- `/d0/` 提交 `login_layer=d0` + `verifycode=<num>`。
- `/agents/` 提交 `login_layer=co|su|ag`（由 tab 决定）+ `pwd_safe=<safe>` 或 `pwd_safe=none`；无 `verifycode`。

### 1.6 成功响应结构

```json
{
  "code": "102", "action": "login",
  "status": "success", "status_code": "4O000",
  "user_id": 52, "username": "admin1", "uid": "...",
  "layer_id": 52, "layer_username": "admin1",
  "pri_type": null,      // 子帐号才非 null（"A-B-B1-B2-C"）
  "user_type": 1,        // 1=主帐号 2=子帐号
  "enable": "Y", "enable_pri": "Y",
  "pay_type": 0,         // 0=自动恢复 1=余额浮动
  "login_layer": "ad",   // 服务端按 level 最终决定
  "retrieve_sw": "Y", "telbot_sw": "Y"
}
```

### 1.7 登入失败码（`vendor/lang/zh-cn.php`）
| Code | 含义 |
|------|------|
| `0X001` | 参数错误（必填项缺失，如未填验证码） |
| `4X001` | IP 不合法 |
| `4X002` | 帐号停用 |
| `4X003` | 帐号禁止登入 |
| `4X004` | 密码错误多次被锁 |
| `4X005` | 帐密不正确 |
| `4X006` | 三分钟后再试（失败 5 次/3 秒触发） |
| `4X013`–`4X016` | 上线帐号停用 / 禁登 / 锁定 / 只能看帐 |
| `4X035` | 帐号或上线状态异常（如 enddate 过期） |
| `4X036` / `4X046` | 帐号或上线租用到期 |
| `4X042` | 验证码错误（仅 ads/ad/d0） |
| `0X002` | 您已被强制登出（他处登入触发） |

### 1.8 强制登出与会话
侦测到本帐号在他处登入时，当前页面强制返回登入页并显示 `0X002 您已被强制登出，请重新登入`。会话保存在 PHP Session（`/var/lib/php/sessions/sess_<PHPSESSID>`），cookie 名 `PHPSESSID`，登入成功后写入 `login_layer` / `user_id` / `uid` 等。登出时 POST `p=get_out` 销毁 session。

---

## 2. 全局界面框架

SPA 由 `static/admin/js/index.js` 装载 上 / 左 / 下 / 右 四块菜单 + 中央内容区 + 多个浮层。页面切换通过 `bodyGoToPage` 事件派发，地址栏不变（仅 hash 用作面包屑）。

### 2.1 顶部菜单（`top_menu.js`）
从左到右：

1. **汉堡 `#mu_hab`**：窄屏下展开/收起左侧大菜单。
2. **返回 `#back`**：派发 `backPage`，回上一层视图（二级页面才出现）。
3. **页面标题 / 面包屑**：
   - 单层页面直接显示 `LS.get("page_" + pageName)`，如"首页"、"报表"、"系统设置"。
   - 帐号树深入页面显示形如 `公司 > 分公司 > 股东 > …` 的面包屑，可点任一层跳到对应列表。
4. **WMC `#wmc`**：弹出 WMC 实时下注监控（`app/wmc/index.php`）新窗口；仅 `pri_type` 含 `A` 时可见；`只能看帐` 隐藏。
5. **公告铃 `#mu_announcement`**：跳公告中心。未读重要 / 私人公告时铃铛右上角亮红点（`mu_dot`）。
6. **快速搜索 `#quick_search`**：进 `quick_search` 页（详 §10）。
7. **问题帐号 `#problem_accounts`**：股东（`co`）专属；非股东隐藏。
8. **客服 `#live_chat`**：触发 LivePerson 在线客服浮层。
9. **个人头像 `#mu_profile`**：展开右侧个人面板（§2.2）。

顶部还有 **在线人数概览** `#onlines`，一行显示 `分公司 0 · 股东 0 · 总代 0 · 代理 12 · 会员 56`，点击任一项跳对应在线页（30 秒自动刷新）。`HIDDEN=Y` 的会员不参与显示但计入内部总数。

### 2.2 右侧个人面板（点头像后展开）
| 节点 | 中文 | 功能 |
|------|------|------|
| `user_code` | 当前 `top.username` | 仅展示 |
| `mySetting` | 我的设定 | 多数版本占位 |
| `my_activities` | 我的活动记录 | 跳 `my_activities`（详 §12） |
| `pswdRec` | 密码恢复 | 调 `get_pwd_recovery?action=init`；`4X025` 时提示功能被禁 |
| `chgPswd` | 更改密码 | 跳 `chg_pwd_inside`，含强度计与"破解时间" |
| `contact` | 联系我们 | 静态联系方式 |
| `troubleshooting` | 故障排除 | `tpl/<lang>/index.html` 新窗口 650×900 显示 DNS/网络排错 |
| `new_url` | 最新网址 | 列会员端 / 手机会员端 / 管理端 / 手机管理端 / 旧帐 五条线路 |
| `feature` | 特色 | 系统亮点 |
| `requirements` | 系统需求 | 浏览器/网络要求 |
| `choose_lan` | 选择语言 | 切 `zh-cn` / `zh-tw` / `en-us` 即时刷新 |
| `logOut` | 登出 | POST `get_out`，清 Session 回登入页 |

### 2.3 左侧主菜单（`left_menu.js`，仅 `/admin/` 与 `/d0/` 的经典版 UI）

> `/agents/` 新版 UI 没有持久左侧图标列；只有 `≡` 汉堡按钮，点击后从左侧滑出。本节描述的是 ADS / AD / D0 经典版 UI 的 8 个图标列。

小图标列 `le_smallG` + 展开大列 `le_bigG`，悬停展开二级。完整结构（仅 ADS 可见全部 8 段；D0 只见前 5 段；AD 见 8 段；详 §17.4.1）：

```
首页 Dashboard
└─ 仪表板
帐户管理 Account
├─ 公司      acc_AD     → acc_ad_list
├─ 分公司    acc_D0     → acc_d0_list
├─ 股东      acc_CO     → acc_co_list
├─ 总代理    acc_SU     → acc_su_list
├─ 代理商    acc_AG     → acc_ag_list
├─ 会员      acc_MEM    → acc_mem_list
└─ 子帐号    acc_Sub    → acc_sub_list
报表 Report
├─ 注单报表  wagerR     → report_main
└─ 旧报表    oldRS      → window.open(125.252.69.75)
即时注单 Analysis
├─ 总览       overViewL  → overView
├─ 滚球       re_L       → totalbet_header (INPLAY)
├─ 今日       today_L    → totalbet_header (TODAY)
├─ 早盘       fu_L       → totalbet_header (EARLY)
├─ 已开赛     started_L  → totalbet_header (STARTED)
├─ 过关       parly_L    → totalbet_header (PARLAY)
├─ 冠军       outright_L → totalbet_header (OUTRIGHT)
└─ 赛果       results_L  → totalbet_header (RESULTS)
注单管理 Betlist
├─ 流水注单   bet_list           → bet_header (LIST)
├─ 改单注单   bet_edit           → bet_header (EDIT)
├─ 异常注单   bet_abnormal       → bet_header (ABNORMAL)
├─ 滚球危险球 bet_live_dangerous → bet_header (LIVE)
└─ 注单搜索   bet_search         → bet_header (SEARCH)
操盘 Match
├─ 赛程  matchList → match_header (MATCH)
└─ 比分           → match_header (SCORE)
日志管理 Log
├─ 公司   log_AD  → log_ad
├─ 分公司 log_D0  → log_d0
├─ 股东   log_CO  → log_co
├─ 总代理 log_SU  → log_su
├─ 代理商 log_AG  → log_ag
└─ 会员   log_MEM → log_mem
系统设置 Setting (仅 ADS / AD 可见，D0 没有)
├─ 系统设置  set_config      → setting_system
├─ 采集设置  set_curl        → setting_header
└─ 数据管理  set_data_manger → data_manger
```

权限隐藏规则（`left_menu.js:208-246`，实测见 §17.4.1）：
- `top.login_layer == "d0"`：隐藏 `操盘` / `日志` / `系统设置` 三段，左侧只剩 5 段图标。
- `top.login_layer == "ad"`：隐藏自身的日志列表与采集设置中针对自身的部分。
- `top.user_enable == "S"`：隐藏整个"即时注单"。
- 子帐号：按 `pri_type` 隐藏对应入口（详 §0.3）：未含 `A` 隐藏即时注单/WMC；未含任意 `B*` 隐藏帐号管理/快速搜索/问题帐号；未含 `C` 隐藏报表。`user_type=2/3` 的子帐号也看不到系统设置。
- `/agents/`（CO/SU/AG）：整个左菜单都不显示——新版 UI 用顶部黑色按钮（报表/帐管/即时注单）+ 汉堡侧滑替代。

### 2.4 底部菜单（`bottom_menu.js`，仅经典版 UI 的手机/平板尺寸）

> **仅 `/admin/` 与 `/d0/` 有底部菜单**。`/agents/` 新版 UI 整个 `bm_*` 都不存在（响应式 dashboard 已自带移动适配）。

5 个快捷按钮：
1. **问题帐号 `bm_problem_li`** — 同顶部"问题帐号"。
2. **公告 `bm_announcement_li`** — 同顶部公告铃。
3. **快速搜索 `bm_quick_search`** — 同顶部"快速搜索"。
4. **客服 `bm_live_chat`** — 同顶部"客服"。
5. **WMC `bm_wmc`** — 弹出 WMC 实时监控。

显示规则同顶部；非股东登入时"问题帐号"隐藏。

### 2.5 全局浮层
- `loading` / `filter_loading`：12 段旋转 spinner。
- `alert_show`：通用确认/错误弹窗。
- `alert_choose_show`：带选项弹窗（确认删除帐号等）。
- `anno_show`：登入后强制阅读公告。
- `notice_show`：首次提醒。
- `newnote_show`：站内信新消息。
- `codeAlert`：右上角短弹（含 COPY 按钮，复制帐号 / 密码 / 错误码到剪贴板）。
- `backtop`：滚动回顶按钮，超过一屏出现。

---

## 3. 首页 / 仪表板（Dashboard）

由 `dashboard_main.js` + `dashboard.js` 渲染，内部 page=`dashboard_main`。

### 3.1 顶部 KPI 卡片
1. **占成收入 `dash_PR`**：当期本帐号按占成应得收入（RMB）。
2. **投注人数 `dash_MW`**：当期有下注的下属会员数。
3. **实货量 `dash_TO`**：当期有效投注总额。
4. **赢 / 输 `dash_WL`**：盈亏额；红字亏、绿字盈。

每张卡片右下角显示本期已进行天数 `第 N 天`（`dash_D` + `dash_Ds`）。

### 3.2 期间走势图（Chart.js）
- 横轴：本期每日。
- 纵轴：盈亏（RMB）。
- 切换按钮：**昨天 / 本周 / 本期**（`perf_yesterday` / `perf_week` / `perf_period`）。
- 悬停 tooltip 显示当日 投注额 / 有效金额 / 盈亏。

### 3.3 即时注单概要
滚球 / 今日 / 早盘 / 过关 / 冠军 当前未结注单笔数；点击直接跳"即时注单"对应分页。

### 3.4 在线统计
重复显示顶部"在线 X"区块（手机端隐藏顶部时仍可见）。

---

## 4. 帐户管理（Account）

七个分页（公司/分公司/股东/总代理/代理商/会员/子帐号）共享同一套交互模式，仅字段略有差异。下述以 **会员（MEM）** 为模板，其它层级差异见 §4.6。

### 4.1 列表页（`acc_mem_list.html`）
顶部工具栏（左→右）：

| 按钮 | 功能 |
|------|------|
| **代理商下拉 `sel_upper_box`** | 切换查看哪一个上级代理商下的会员；选 `-` 显示自身全部下属 |
| **帐户状态下拉 `sel_view`** | 全部 / 启用(Y) / 停用(N) / 只能看帐(S) / 禁止登入(F) |
| **搜索框 `input_search`** | 按帐号/名称模糊搜索；移动端用放大镜 `btn_ph_search` 切换 |
| **清除按钮 `btn_delete`** | 一键清空搜索框 |
| **搜索按钮 `btn_search`** | 触发查询；服务端返回后渲染 `div_show` |
| **新增会员 `btn_add_acc`** | 跳 `acc_mem_add` |

列表表头可点击排序：`title_username` 帐号、`title_alias` 名称、`title_maxcredit` 信用额度、`title_currency` 货币、`title_adddate` 新增日期。

每行字段：
- **会员帐号** `*USERNAME*`：蓝色加粗，点击进帐号详情。
- **名称** `*ALIAS*`：备注名。
- **登入帐号** `*PASSWD_SAFE*`：登入时使用的安全代码。
- **密码** `*PW*`：默认掩码 `******`，不显示明文。
- **信用额度** `*MAXCREDIT*`：点击展开"修改额度"浮层
  - 剩余额度只读
  - 信用额度输入框（按所选币种，下方实时换算 RMB）
  - **保存** / **取消**
  - 错误：`您输入的额度大于可用额度，请重新输入。`
- **绑定 IP** `*SETIP*`：浮层支持输入 IP / **撤销绑定** / **取消** / **保存**。
- **绑定网址** `*SETURL*`：同上，限制只能从指定网址登录。
- **货币** `*CURRENCY*`：只读。
- **帐户状态**：下拉 4 选 1，提交即时生效（`acc_str_enable`）。
- **隐单帐号**：开启后该会员注单不计入上级即时统计，仅入流水（仅会员层有此列）。
- **新增日期** `*ADDDATE*`：只读。
- **操作列**：
  - `btn_edit` 编辑（笔形图标）— 跳详情页
  - `btn_dele` 删除（垃圾桶）— 二次确认
  - `btn_unlock` 解锁（小锁）— 帐号因密码错误次数过多锁定时出现，点击恢复 `Y`

### 4.2 新增页（`acc_mem_add.html`）
顶部 `acc_menu` 分页：**用户详细设定 / 退水设定 / 占成设定 / 特殊权限**。

#### 4.2.1 用户详细设定
**左栏 — 基本资料**
- **代理商**：自动填充选定的上层；从代理商列表点"新增"时锁定。
- **盘口种类**：A/B/C/D/E（不同退水模型）。
- **帐号**：4–12 位英文+数字（错误码 `user_limit` 帐号至少四个字元）。
- **名称**：1–10 字。
- **登入帐号 / 安全代码**：实际登入字串。
- **密码 / 确认密码**：右侧 5 段强度计（非常弱→强）+ 破解时间估计（zxcvbn）。
- **密码恢复开关**：`Y`/`N`，启用后允许会员通过邮箱找回。
- **帐户状态**：默认 `启用`。

**右栏 — 额度模式和金额**
- **额度模式**：
  - **自动恢复 `pay_type_0`**：日结后额度自动回上限（信用模式）。
  - **余额浮动 `pay_type_1`**：纯余额制，不自动恢复。
- **代理剩余额度**：上层可分配额度（只读）。
- **信用额度**：本次分配；下方显示 "人民币 X,XXX.XX" 折算与 "1 USD = 8 人民币" 汇率。
- **关于额度模式**：链接弹长说明。

**底部按钮**
- **保存与新增** `btn_new`：提交后清空表单继续。
- **保存** `btn_save`：提交后跳详情/列表。
- **取消** `btn_cancel`：放弃修改返回列表。

错误提示：`empty_user`、`user_limit`、`empty_alias`、`empty_passwd`、`empty_credit`、`credit_over`（额度超过上线剩余）。

#### 4.2.2 退水设定 / 占成设定（`acc_mem_comm.html`）
按盘口种类分块（A/B/C/D…），每块：
- **退水设定**：分球类（足球 / 篮球 / 网球 / … / 冠军）填百分比；0 → `0%` ；不能高于上线最高退水（错误码 `0X010`）。
- **单注最高限额 / 单场最高限额**：
  - 错误码：`0X007 / 0X008` 超出上线值。
  - 字段：独赢、滚球独赢、让球大小单双、滚球让球大小单双、其他玩法、滚球其他玩法、冠军。
- **占成设定**（SU/CO/D0/AD 才有）：股东+总代+代理三方占成总和需在 5–8 成内，否则报 `su_ag_winloss_error`。
- **最低限额 / 最高派彩**：依母帐号同名设定生效。

底部 **保存** 提交。

#### 4.2.3 权限（仅子帐号 `acc_sub_add.html`）
五个权限复选框：
1. **管理帐户（只观看）** — `B`
2. **管理帐户（更改和观看）** — `B1`
3. **管理帐户（更改额度）** — `B2`
4. **即时注单** — `A`
5. **报表** — `C`

未勾任何"管理帐号"会触发 `user_manage` 错误。

#### 4.2.4 特殊权限（父级是 公司 / 分公司 才出现）
- **股东在线 / 总代在线 / 代理在线**：禁用 / 启用下拉。
- **会员在线**：下拉 + 三个复选（**记录** / **网址** / **投注**）。
- **改单设置**：复选改单、改额度、撤单等开关。
- **私聊会员**：禁用 / 启用。

### 4.3 详情/编辑页（`acc_mem_detail.html`）
顶部 **取消 `btn_cancel`** 与 **保存 `btn_save`** 同新增页。

特有区块：
- **更改密码 `btn_psw`**：弹层，输入新密码 + 强度计 + 破解时间 + 防混淆按钮（取消 / 保存），错误 `0X012`。
- **密码恢复开关 `input_psw_recovery`**：滑块（绿/灰）。
- **帐户概况**：最后登入日期、密码最后更新日期。
- **绩效概况**：昨天 / 本周 / 本期 三选一，显示 赢/输、投注额、有效金额。
- **关于额度模式** 链接。

### 4.4 删除/锁定确认弹窗
点 `btn_dele` 后：
- **是 / 否** 二选一。
- 若是会员且有未结注单 → "存在未结算注单，无法删除"。
- 成功 → `0XDELE 删除成功`。

### 4.5 复制帐密
新增成功后弹窗：
```
帐号：xxx
密码：xxx
```
按 **COPY `btn_copy`** 一键复制全部字串，提示 `资料已复制 (str_copied)`。

### 4.6 不同层级差异
| 层级 | 列表页特征 | 新增页特殊字段 |
|------|------------|-----------------|
| 公司 (AD) | 增 SMA 在线开关、私聊会员开关；可指定盘别 | 占成上限 100% |
| 分公司 (D0) | 同公司，占成上限 ≤ 公司剩余 | 同上 |
| 股东 (CO) | 多一列"占成"；无 SMA 在线列 | 占成、退水须在公司允许范围 |
| 总代 (SU) | 多"占成 / 最高退水"两列 | 同上 |
| 代理 (AG) | 多"会员数"列；可一键查下属会员 | 退水按盘口种类切换 |
| 会员 (MEM) | 含 IP / URL 绑定、隐单开关 | 无占成；额度模式可选自动恢复 / 余额浮动 |
| 子帐号 (Sub) | 单独 `acc_sub_list`，列名下管理的帐号清单 | 五项权限位 + 特殊权限 |

### 4.7 帐户事件日志（`acc_eventlog.html`）
列表页右上"事件"链接进入。内容：
- 操作类型：`新增帐号`、`更改密码`、`更改额度`、`更改帐户状态`、`绑定 IP / URL`。
- 操作人：上级帐号名（含子帐号）。
- 时间、备注。

### 4.8 信用日志（`acc_creditlogs.html`）
仅会员 / 代理可见。字段：时间、变动类型（增/减）、变动金额、变动后余额、操作人。顶部 "今日 / 昨日 / 本周 / 本月" 切换。

### 4.9 在线下属（`acc_onlineMem.html`）
列出当前在线下属（按层级显示对应页）：帐号、名称、登入时间、停留时长、当前 IP、地理位置；操作列含 **强制登出**。

---

## 5. 报表（Report）

入口：左菜单 `wagerR` → `report_main`。两大模式："注单报表" / "取消单分析"，由顶部 `btn_wager` / `btn_cancel` 切换。

### 5.1 左侧搜寻区
所有筛选项都有桌面 (`#xxx_div`) 与移动 (`#xxx_div_600` select) 双 UI：

1. **结果类型**：`有结果` / `未有结果`。
2. **报表类别**（"取消单分析"模式）：取消单分析 `D` / 非正常投注单 `D4`。
3. **日期范围**：`input_start` / `input_end`（自带日历控件 `calendar.js`）。
4. **快捷日期**：昨日 / 今日 / 明日 / 本星期 / 上星期 / 本期 / 上期。
5. **球类**：所有 / FT / BK / TN / VB / BS / OP / FS / BM / TT / SK。
6. **下注方式 `wtype`**（按球类动态生成）：独赢、让球、大/小、单/双、半场、波胆、特殊玩法等多选。
7. **盘口阶段**：所有 / 滚球 / 初盘 / 早盘。
8. **占成视角**（按自身层级开放）：
   - 显示所有 / 公司 / 分公司 / 股东 / 总代 / 代理 占成
   - 组合：分公司+股东+总代+代理（`dcsa`）等
   - 我的占成（自身实际拿到的部分）。
9. **下注币种**：人民币 / 港币 / 美金 / 全部。
10. **网站来源**：旧站 / 新站 / 全部（多端合一 Crown 部署时使用）。

底部 **刷新 `filter_submit`** 触发查询；**记住我的设定 `remenberFilter`** 复选写入 LocalStorage `wmc_filter_*`。

### 5.2 右侧报表汇总
- 默认按"代理商汇总"展示。列：用户/名称、笔数、有效金额、输赢、退水、占成损益、净额、币种。
- **下钻**：点击任一行 → 进下一层（公司→分公司→股东→总代→代理→会员→注单）；面包屑 `menu_ul` 同步。
- **导出 Excel**：右上 `btn_excel` → `report_excel.html` 模板，浏览器打印或另存。
- **打印**：右上 `btn_print` 调 `window.print()`。
- **总计行**：固定表底，加粗。

### 5.3 注单详情（`report_list_bet.html`）
下钻到底层会员后进注单流水：
- 字段：日期 / 注单号 / 玩法 / 内容（队名+让分+赔率） / 下注金额 / 可赢金额 / 结果（赢/半赢/输/半输/退还/未结算） / 赛果 / 备注 / 操作。
- 操作列 `tid_*` 按钮（箭头）：弹"注单详情"侧卡，含完整盘口、滚球比分、风控标签、改单历史、撤单原因（如 `CancelType-3 赛事延赛`）。
- 移动端使用 `xmp_764_down_wagers_content` 模板，整笔注单合并到一张卡片。

### 5.4 月帐期数表（`report_period.html`）
- 入口：报表汇总顶部"期数"按钮（部分版本）。
- 显示每月每期的开始/结束日期与本帐号在该期的总收入。

### 5.5 取消单分析模式
切换后筛选区显示 **取消单分析 / 非正常投注单** 两类。表格附 "取消原因" 列：
- `CancelType0` 正式比分
- `-1` 赛事取消、`-2` 队名错误、`-3` 赛事延赛、`-4` 时间不正规、`-5` 腰斩、`-6` 弃权、`-7` 主客场错误、`-8` 联赛名称错误、`-9` 无 PK/加时、`-10` 赛程错误、`-11` 不显示赛程、`-12` 取消、`-13` 腰斩、`-14` 无局数。

### 5.6 旧报表（`oldRS`）
点击 `window.open` 到 `https://125.252.69.75`（同帐号体系无需重登）。仅保留作历史数据查阅。

---

## 6. 即时注单 / 总览（Total Bets）

左菜单 `analysis` 下 8 个子页面，共享路由 `totalbet_header` + `tbet_showtype`：

### 6.1 总览（overview）
- 顶部：日期切换（昨天 / 今日 / 本周 / 本期）。
- 5 张大卡：**滚球 / 今日 / 早盘 / 过关 / 冠军** 当前注单笔数与总下注金额；点击直接跳对应分页。
- 中部：分时（每 30 分钟）下注趋势线（Chart.js）。
- 底部：联盟 TOP10（按下注金额降序），可点击下钻到该联盟下的比赛。

### 6.2 滚球（INPLAY）/ 今日（TODAY）/ 早盘（EARLY）
共享近似模板（`OP_re.html` / `OP_today_allbet.html` / `OP_fu_allbet.html`）。

**顶部筛选条**
- 球类下拉。
- 联赛下拉：自动列出当前阶段有注单的联赛。
- 笔数下限：`大于 / 小于 / 等于 N` 笔。
- 排序按钮：联盟 / 投注笔数 / 下注金额，可切升降序。

**主表格**（`OP_started.html` 模板）
每个联盟一段，可点 `tbet_collapse_switch` 折叠：
- 第一行：**联盟名** + 总笔数（单式/滚球分两行）+ 下注总金额（单式/滚球分两行）。
- 比赛行：
  - 日期 / 时间 / `*MIDFIELD*`（中场）`*LIVE*`（滚球图标）`*CANCEL_TYPE*`
  - 主队 + 比分（红色：已进球） `*SCORE_COLOR_H*`
  - 客队 + 比分
  - 单式 / 滚球投注笔数、下注金额（蓝色链接）
  - **`*MORE_COUNT*` 更多盘** — 展开该比赛所有盘口：玩法名 / 主队赔率 / 客队赔率 / 投注笔数 / 投注金额。
  - **箭头 `tbet_td_indside_arrIcon`** — 跳到该比赛注单流水（`match_wagers_list_bet.html`）。

**底部**：翻页器（每页 50 场） + 总计行（联盟数 / 比赛数 / 总笔数 / 总金额）。

### 6.3 已开赛（STARTED）
同 §6.2，但只列已开赛未完赛的比赛。多了：
- **比分实时刷新**：每 15 秒轮询 `get_started_allbet_wager.php`。
- **风险标记**：连续大额下注或盘口骤变会出现 `tbet_stop_icon` 红圈。

### 6.4 过关（PARLAY）
- 按串关 N 串 1 / N 串 2 / … 分组。
- 每行：注单号 / 会员 / 串关组合（展开看每场） / 总赔率 / 下注金额 / 可赢金额。

### 6.5 冠军（OUTRIGHT）
- 按 "赛事 + 冠军类别（季冠军 / 杯冠军 / 进球王 / 小组出线…）" 分组。
- 列：球队 / 赔率 / 下注笔数 / 下注金额。

### 6.6 赛果（RESULTS，`OP_results.html`）
顶部分页：**未结算 / 已结算 / 全部**。
每行 `*MATCH*`：
- 联赛、日期、主队 / 客队、最终比分（红字主进球，蓝字客进球）。
- 半场比分、加时、点球。
- **`btn_edit_score`**（仅公司层或被授权子帐号可见）：弹 `OP_match_edit.html` 改赛果（主队全场/半场、客队全场/半场、加时、点球）+ **保存** / **取消**。改后触发全部相关注单重算。
- **`btn_cancel`**：撤销整场赛事 — 选取消类型（见 §5.5）+ 备注 + **确认 / 取消**。

### 6.7 通用功能
- **导出**：右上下载图标，导出 Excel/CSV。
- **打印**：浏览器原生。
- **自动刷新**：滚球/今日 30 秒；早盘 5 分钟；冠军/已结算 不自动刷新。

---

## 7. 注单管理（BetList）

入口路由 `bet_header` + pageName ∈ `LIST` / `EDIT` / `ABNORMAL` / `LIVE` / `SEARCH`，由 `bet_index.html` 渲染。顶部分页 `bet_LIST/bet_EDIT/bet_ABNORMAL/bet_LIVE` 切换。

### 7.1 流水注单（LIST）
**桌面端筛选条**（`re_sreachterm_allG`）：

1. **球类 `gtype_div`**：所有 / FT / BK / TN / VB / BM / TT / BS / SK / OP / FS。
2. **结果 `result_div`**：所有 / 未结算 / 已结算 / 赢 / 半赢 / 输 / 半输 / 退还。
3. **下注金额 `stake_div`**：
   - **所有球类 (ALL)**：单输入框"大于 N"。
   - **各别体育 (PER)**：每球类独立阈值。
4. **下线 `downline_div`**：搜索框 + 多选复选；提示"您最多可选 5 个帐号 (sub_mlimit/sub_mlimit2)"。
5. **盘口类型 `market_div`**：所有 / 滚球 / 初盘 / 早盘。
6. **联盟 `league_div`**：搜索 + 热门联盟分组 + A-Z 排序。
7. **赛事 `event_div`**：联盟选定后自动加载，二次搜索。
8. **日期 `dates_div`**：按下注日期筛选；带搜索。

**右侧操作**
- **刷新 `filter_submit`**：执行筛选。
- **记住我的设定 `remenberFilter`**：写入 LocalStorage `wmc_filter_*`。

**移动端筛选**
收纳到汉堡 `bet_burger_div`，每条按"球类 / 结果 / 下注金额 / 下线 / …"分行；尾部"记住我的设定"复选。

**主数据表头**
日期 / 会员 / 退水 / 注单号 / 玩法 / 内容 / 下注金额 / 可赢金额 / 结果 / 赛果 / 占成（`*ADD_TD*` 动态）/ 操作箭头。

**单注单展开**（`tid_*` 箭头）：弹 `bet_detail.html`：
- 投注详情：玩法、主客让分、赔率。
- 占成分摊：代理 20% / 总代 20% / 股东 20% / 分公司 20% / 公司 20%。
- 风控标签：是否危险盘、是否 IP 异常、是否同 IP 多帐。
- 改单历史。

### 7.2 改单注单（EDIT，`bet_edit_index.html` + `bet_edit_detail.html`）
- 列表只显示曾被改单或撤单的注单。
- 每行 **改单详情** 按钮：弹 `bet_edit_detail.html`
  - 原始赔率 → 修改后赔率
  - 原始可赢金额 → 修改后可赢金额
  - 改单时间、原因（操作员选择的标签）、操作员帐号
- 操作列：
  - **撤回此次改单**（仅公司层）：二次确认，注单回改前状态。
  - **复制注单号 `account_copy`**：一键复制单号。

### 7.3 异常注单（ABNORMAL）
- 列表条件：
  - 风控引擎标记 `is_abnormal=1`
  - 同会员 1 分钟内连续投注 ≥ N 次
  - 同 IP 多帐号同时投注
- 顶部加 **异常类型** 下拉：全部 / 套利 / 同 IP / 高赔率追单 / 系统标记。
- 操作列：
  - **取消注单** — 二次确认 + 必填取消原因。
  - **标记安全** — 移出异常列表。

### 7.4 滚球危险球（LIVE）
- 仅显示 `LIVE` 阶段且系统判定为"危险球"的注单（如比分剧烈变化前几秒入场）。
- 表头多两列：**赛事盘口当前赔率** / **下注时赔率差** (%)。
- 操作列：**取消**（该球种全场注单撤销） / **保留**（继续等待结算）。

### 7.5 注单搜索（SEARCH）
- 顶部仅"输入注单号 / 会员帐号"搜索框 + 日期范围。
- 命中后直接显示该注单的完整 `bet_detail.html`。

### 7.6 异常单提醒
当 `异常注单 > 0` 时，顶部 `mu_problem` 亮红点；底部 `bm_problem_i` 同步亮灯。

---

## 8. 操盘（Match）

入口 `match_header`：

### 8.1 赛程（MATCH，`match_index.html`）
- 顶部：球类切换 + 联赛搜索 + 日期切换（今日 / 明日 / 后天 / 自定义）。
- 表格：日期、时间、联盟、主队、客队、当前下注情况（笔数 / 金额）、开盘状态。
- 操作列：
  - **冻结开盘 / 解冻开盘** — 点击切换；冻结后会员前台无法看到该比赛赔率。
  - **关闭单独玩法** — 弹层勾选要关掉的玩法（独赢/让球/大小…）。
  - **查看注单** — 进 `match_wagers_index`，看该场所有注单。

### 8.2 比分（SCORE）
- 显示已开赛 / 已结束比赛。
- 点 **改赛果** 弹 `OP_match_edit.html`（同 §6.6）。
- 点 **取消比赛** 选择 CancelType。

### 8.3 单场注单详细（`match_wagers_account.html`）
- 顶部：比赛名、最终/即时比分、是否结算。
- 表：会员 / 玩法 / 下注 / 可赢 / 实赢；可下钻到单笔注单。

---

## 9. 日志管理（Log）

每个层级独立日志页（`log_ad/d0/co/su/ag/mem.html`），共享 `log_record.html` 模板（顶部时段：今日 / 昨日 / 本周 / 本月）。

字段：
- 时间
- 操作员
- 操作类型：新增帐号 / 更改密码 / 更改额度 / 启用-停用 / 改单 / 取消注单 / 改赛果 / 改盘口 / 推送公告 / 登入 / 登出 / 强制登出 / 修改 IP / 修改网址 / 修改占成 / 修改退水…
- 目标帐号
- 备注 / 详情（悬停展开）
- 来源 IP

### 9.1 登入日志（`log_login.html`）
- 单独一份，按 "今日/昨日/本周/本月" 过滤。
- 字段：登入时间、登出时间（仍在线显示 "在线中"）、停留时长、IP、操作系统、浏览器、登入方式（Web / WMC / API）。
- 操作列：**强制登出**（仅公司层）。

### 9.2 在线纪录（`log_online_record.html`）
显示当前活跃会话，可一键 **强制登出 / 锁定 IP**。

---

## 10. 快速搜索（Quick Search）

入口：顶部 `quick_search` / 底部 `bm_quick_search`，由 `quick_search.js` 渲染。

- 顶部：搜索框（按帐号 / 名称 / IP / 注单号 / 联盟 / 队名通用搜） + **搜索 `btn_search`**。
- 帐号结果：层级（`layer_type_name_*`） / 帐号 / 名称 / 状态 / 上线 / 操作（编辑 / 强制登出 / 切换状态）。
- 注单结果：直接显示 `bet_detail`。
- 联盟结果：跳操盘 → 该联盟赛程页。
- **下属层级筛选**：股东 / 总代 / 代理 / 会员 / 子帐号 五个 toggle，多选生效。
- **状态筛选**：启用 / 停用 / 只能看帐 / 禁止登入。

---

## 11. 公告（Announcement）

入口：顶部 `mu_announcement` / 底部 `bm_announcement_li`。

### 11.1 列表区
顶部分页：
- **全部公告**
- **重要公告**（`important`，红图标）
- **股东 / 代理公告**（`personal`，绿）
- **私人消息**（`proNews`，紫）
- **私人会话**（`proChat`，黄）

每行：标题 / 创建人 / 创建时间 / 状态（草稿 / 发布 / 已撤回） / 操作。

操作按钮：
- **查看** — 弹整段 HTML。
- **修改** — 跳 `ann_*_edit`（`ann_*_edit.html`）。
- **撤回** — 二次确认；撤回后会员前台不再显示。
- **删除** — 二次确认。

### 11.2 新增公告（`ann_*_add.html`）
| 表单 | 文件 | 主要字段 |
|------|------|----------|
| 重要公告 | `ann_important_add.html` | 标题、内容（富文本编辑器）、生效时间段、对象层级（公司/分公司/股东/总代/代理/会员）、是否强制弹窗、是否需要 "我已阅读" 按钮 |
| 股东/代理公告 | `ann_personal_add.html` | 同上，只能下发给股东及以下 |
| 私人消息 | `ann_proNews_add.html` | 标题、内容、目标帐号（多选）、是否允许回复 |
| 私人会话 | `ann_proChat_add.html` | 同上，允许往返会话 |

底部按钮：
- **预览** — 弹层显示发送后的实际样式。
- **保存草稿**
- **发布** — 二次确认 + 时区提示。
- **取消** — 返回列表。

### 11.3 阅读弹窗
登入后若有未读重要公告，自动弹 `notice_show`（无遮罩关闭，必须点 **我已阅读** 才能继续）。

---

## 12. 我的活动记录（My Activities）

入口：顶部头像 → `my_activities`。

- 时段切换：今日 / 昨日 / 本周 / 本月。
- 表格：时间、活动类型（同 §9）、目标帐号、详情、IP。
- 仅显示当前登入帐号本人的操作；用作个人审计。

---

## 13. 系统设置（仅 `/admin/` 下的 ADS 和 AD 可见；D0 与 `/agents/` 无此菜单）

### 13.1 系统设置（`setting_system.html`）
两张分页：

#### 13.1.1 单注最低限额 / 最高派彩
按市场分 6 段：
- 独赢 / 滚球独赢 (`min_m / max_m`)
- 让球、大/小、单/双 (`min_r / max_r`)
- 滚球让球、滚球大/小、滚球单/双 (`min_re / max_re`)
- 其他玩法 (`min_dt / max_dt`)
- 滚球其他玩法 (`min_rdt / max_rdt`)
- 冠军 (`min_fs / max_fs`)

错误码：`0X00MINM`、`0X00MINR`、`0X00MINRE`、`0X0MINDT`、`0X0MINRDT`、`0X0MINFS`、`0X00MAXM`、`0X00MAXR`、`0X00MAXRE`、`0X0MAXDT`、`0X0MAXRDT`、`0X0MAXFS`。

底部 **保存 `btn_save`**。

#### 13.1.2 维护设置
- **维护时间 `input_maintain_time`**：日期/时间区间。
- **是否维护**：单选 是 / 否。
- **保存 `btn_save1`**：开启后会员前台显示维护页，无法登入。

### 13.2 采集设置（`setting_curl.html`）
4 张分页：

| 分页 | 用途 |
|------|------|
| **前端采集** | 配置会员前台调用的赛事/赔率源（账号、密码、URL） |
| **后台采集** | 配置后台核验源（独立通道） |
| **备用 URL** | 灾备域名清单 |
| **赛果采集** | 赛果回填源 |

每张分页表格列：UID、采集帐号、密码、网址、采集状态、操作。

操作列：
- **新增采集帐号 `btn_new`**：弹层填 UID / 帐号 / 密码 / URL → **保存**。
- **`btn_edit`**：行内编辑模式。
- **`btn_dele`**：删除帐号。
- 顶部全局 **保存 `btn_save`**：批量保存所有行修改。

### 13.3 数据管理（`data_manger`）
列出已存在的赛事数据来源（db_sports / Odds-API / api-sports）状态、最近采集时间、成功率。

按钮：
- **立即采集**：手动触发一次。
- **清空缓存**：清 `/dev/shm/oddsapi_live/` 等目录。
- **重启采集服务**：重启 ws-relay / Python ingest（仅系统化部署中）。

---

## 14. 在线统计页

入口：经典版 UI 顶栏中部的"线上 XXX (N)" 文字链；点击跳对应在线列表。可见性按 layer 实测如下（详 §17.4.1）：

| 路由 | 中文 | ADS | AD | D0 | CO | SU | AG |
|------|------|-----|----|----|----|----|----|
| `online_ad` | 在线公司 | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `online_d0` | 在线分公司 | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| `online_co` | 在线股东 | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| `online_su` | 在线总代 | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| `online_ag` | 在线代理 | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| `online_member` | 在线会员 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

> 规则：每层只看到比自身**低一级或更低**的在线列表。`/agents/` 新版 UI 没有顶部在线统计条；改用左上 `≡` 汉堡或顶部"接帐号"等按钮间接进入。

每张表头一致：层级、帐号、名称、登入时间、停留时长、IP、操作（**查看活动 / 强制登出**）。30 秒自动刷新。

---

## 15. 密码恢复（Password Recovery）

入口：顶部头像 → `pswdRec`。流程：

1. 输入帐号 → 服务端发验证码到绑定邮箱（提示 `4O005 验证码已发送到您的电子邮件`）。
2. 输入验证码（5 分钟有效，错 3 次锁 5 分钟）。
3. 设置新密码 + 强度校验。
4. 成功 → `4O006 已成功注册` 后回登入页。

错误码：
- `0X001` 参数错误
- `4X007` 未设定 email
- `4X025` 此功能暂时已被禁用，请联系您的上线
- `4X026` 验证码发送次数过多
- `4X027` 连不到 MailServer
- `4X028` MailServer 发送验证码失败
- `get_mail_canceal` 请输入有效的电子邮件
- `input_verify_cancel` 取消密码恢复？
- `remove_email` / `remove_email_message` 删除恢复邮箱

---

## 16. 更改密码（Inside）

入口：顶部头像 → `chgPswd`，由 `chg_pwd_inside.js` 驱动。

字段：
- **旧密码**
- **新密码**：右侧 5 段强度灯 + "破解时间预估"（如 `1秒` / `1分钟` / `1小时` / `1天` / `1个月` / `1年` / `1世纪`）。
- **确认新密码**
- 显示规则：至少 2 个字母+数字、3 个不同字符、6–12 位、无空格。

按钮：
- **保存** — 提交；成功提示 `upd_success 更改成功` 并回首页。
- **取消** — 返回。

错误：`0X012` 旧密码错误、`0X013` 新旧密码相同、`0X014` 复杂度不足。

---

## 17. 三套后台 + 登 0/1/2/3 全面差异（实测）

### 17.1 三套后台与登入流程

| 项 | `/admin/` | `/d0/` | `/agents/` |
|----|-----------|--------|------------|
| **服务的 layer** | `ads`（超管）+ `ad`（公司） | `d0`（分公司） | `co` / `su` / `ag` 三选一 |
| **登入页文件** | `view/admin/other/login.html` | `view/d0/other/login.html` | `view/agents/<lang>/other/login.html` |
| **登入 JS** | `static/admin/js/login.js` | `static/d0/js/login.js` | `static/agents/js/login.js` |
| **顶部 tab 数** | 1（"报表管理系统"，不可切换） | 1（"报表管理系统"，不可切换） | **3**：`btn_A` 登入 1 / `btn_B` 登入 2 / `btn_C` 登入 3 |
| **`top.login_layer` 写入时机** | 前端写死 `"ad"` → 服务端按 `admin.level` 改写为 `"ads"` 或保持 `"ad"` | 前端写死 `"d0"` | tab 点击触发 `chgLoginlayer1/2/3()`：分别写入 `"co"` / `"su"` / `"ag"` |
| **selLayer 默认值** | `"A"`（仅占位，不影响 layer） | `"A"`（仅占位） | `"A"` = 登 1 默认；切换 tab 时改为 `"B"`/`"C"` |
| **语言切换** | 锁定 zh-cn，无下拉 | 锁定 zh-cn，无下拉 | `lang_btn` 可切繁/简/英 |
| **数学验证码** | ✅ 必填（`hrhverifycode` 算术题） | ✅ 必填 | ❌ 不需要 |
| **"忘记密码"链接** | ❌ 无 | ❌ 无 | ✅ `forgot_pwd` |
| **"安全代码 `pwd_safe`"输入框** | ❌ 无 | ❌ 无 | ✅ 登 1 / 登 2 显示，登 3 自动隐藏 (`Safe.style.display="none"`) |
| **"未设定安全代码不需输入"提示** | ❌ | ❌ | 登 1 / 登 2 显示，登 3 隐藏 |
| **登入页推荐浏览器图标** | ✅ Chrome/UC/Safari/火狐 | ✅ 同 | ✅ 同 |
| **Cookie 持久化 key** | `ag_userA` | `ag_userA` | `ag_userA` / `ag_userB` / `ag_userC`（按 selLayer 区分） |
| **POST 端点** | `/admin/transform.php` | `/d0/transform.php` | `/agents/transform.php` |
| **POST 必填参数 `p=`** | `login_chk` | `login_chk` | `login_chk` |
| **POST 必填参数 `login_layer=`** | `ad`（服务端按 level 重写） | `d0` | `co` / `su` / `ag` |

> **登入页截图见**：`@/Volumes/T7/Crown-gold/.notes/probe_login_ad_admin1.png`、`@/Volumes/T7/Crown-gold/.notes/probe_login_d0_d010101.png`、`@/Volumes/T7/Crown-gold/.notes/probe_login_ag_d111111_co.png`。

### 17.2 登入提交参数（实测 POST body）

所有 layer 共同字段：`p=login_chk` · `ver=<version>` · `login_layer=<L>` · `username=<U>` · `pwd=<P>` · `langx=zh-cn` · `uid=` · `auto=` · `blackbox=` · `userAgent=<b64>`。

差异：

| Layer | 验证码 | 安全代码 | 帐号字段查询 |
|-------|--------|----------|--------------|
| `ads` / `ad` / `d0` | `verifycode=<num>` 必填 | 不发送 | `admin.name` / `rank.name` |
| `co` | 不发送 | `pwd_safe=<str>` 或 `pwd_safe=none` | `rank.name AND level=3 AND pwd_safe=…` |
| `su` | 不发送 | `pwd_safe=<str>` 或 `pwd_safe=none` | `rank.name AND level=2 AND pwd_safe=…` |
| `ag` | 不发送 | `pwd_safe=none`（被忽略） | 先试 `rank.name AND loginname IS NULL AND level=1`；若无则改用 `rank.loginname=<U> AND level=1` |

### 17.3 登入响应字段（实测）

成功示例（`POST /admin/transform.php`，user=`admin1`/`Aa123456`）：

```json
{
  "code": "102",
  "action": "login",
  "status": "success",
  "status_code": "4O000",
  "user_id": 52,
  "username": "admin1",
  "uid": "a17d458771…",
  "layer_id": 52,
  "layer_username": "admin1",
  "pri_type": null,         // 主帐号；子帐号会是 "A-B-B1-B2-C" 之类
  "user_type": 1,           // 1=主帐号；2=子帐号
  "enable": "Y",
  "enable_pri": "Y",
  "pay_type": 0,            // 0=自动恢复；1=余额浮动
  "login_layer": "ad",      // 服务端按数据库回写的最终 layer
  "retrieve_sw": "Y",       // 密码恢复功能开关
  "telbot_sw": "Y"          // Telegram bot 通知开关
}
```

**实测六类帐号响应对照**：

| 帐号 | 入口 | 提交 layer | 数据库 level | 响应 `login_layer` | `user_type` | `pri_type` | `pay_type` | `layer_id` |
|------|------|-----------|--------------|---------------------|-------------|------------|------------|-------------|
| `abu777` / `Aa123456` | `/admin/` | `ad` | `admin.level=0` | **`ads`** ⚠️ | 1 | `null` | 0 | 1 |
| `admin1` / `Aa123456` | `/admin/` | `ad` | `admin.level=1` | **`ad`** | 1 | `null` | 0 | 52 |
| `Aa100000` / `Aa11223344` | `/admin/` | `ad` | `admin.level=1` `isMaster=1` | **`ads`** | **2**（子帐号） | `"A-B-B1-B2-C"` | 0 | 1（指向父 abu777） |
| `d010101` / `Aa12345678` | `/d0/` | `d0` | `rank.level=4` | `d0` | 1 | `null` | 0 | 11 |
| `d111111` / `Aa12345678` + `Aa123123` | `/agents/` 登 1 | `co` | `rank.level=3` | `co` | 1 | `null` | 0 | 12 |
| `d222222` / `Aa12345678` + `Aa123123` | `/agents/` 登 2 | `su` | `rank.level=2` | `su` | 1 | `null` | 0 | 13 |
| `sealin11` / `Sealin1226` | `/agents/` 登 3 | `ag` | `rank.level=1` (`loginname=sealin11`) | `ag` | 1 | `null` | **1（余额浮动）** | 35 |

> 关键点：**前端发送的 `login_layer=ad` 与服务端最终回写的 `login_layer` 不一定一致**——服务端会根据 `admin.level` 自动改写为 `ads`（level 0 + isMaster 1 子帐号 / level 0 主超管）或 `ad`（level 1 主帐号）。所有后续 SPA 行为都按响应里的 `login_layer` 走。

### 17.4 登入后 UI（两套完全不同的前端）

`/admin/` + `/d0/` 用的是 **经典版后台 UI**（红色顶栏 + 8/5 个左侧图标 + 多块小屏）；`/agents/` 用的是 **新版 dashboard UI**（红色顶栏 + 操作按钮 + KPI 大字 + 甜甜圈图）。两套从代码到样式都是独立的，不是同一个 SPA 的不同视图。

#### 17.4.1 经典版（`/admin/` ADS / AD，`/d0/` D0）

参考截图：`@/Volumes/T7/Crown-gold/.notes/probe_after_ads_abu777.png`、`@/Volumes/T7/Crown-gold/.notes/probe_after_ad_admin1.png`、`@/Volumes/T7/Crown-gold/.notes/probe_after_d0_d010101.png`。

共同结构：
- 顶栏：左 `首页`、中部"线上 XXX (N)" 在线统计、右上四个图标（铃铛 / 客服 / 闪电 / 人头）。
- 左侧：垂直图标列。
- 中央：3 行 3 列的卡片网格（报表 / 帐管 / 即时注单 大按钮 → 绩效概况 / 帐户概况 → 下线状态 / 赛程概况 / 注单状态）。

ADS vs AD vs D0 实测可见差异：

| 顶栏在线统计项 | ADS (abu777) | AD (admin1) | D0 (d010101) |
|----------------|--------------|-------------|--------------|
| 线上**公司** (N) | ✅ | ❌ | ❌ |
| 线上分公司 (N) | ✅ | ✅ | ❌ |
| 线上股东 (N) | ✅ | ✅ | ✅ |
| 线上总代 (N) | ✅ | ✅ | ✅ |
| 线上代理 (N) | ✅ | ✅ | ✅ |
| 线上会员 (N) | ✅ | ✅ | ✅ |

> 规则：每个 layer 只看到比自己 **低一级或更低** 的在线统计。ADS 见 6 项；AD 见 5 项（少"公司"）；D0 见 4 项（再少"分公司"）。

| 左侧图标 | ADS | AD | D0 |
|-----------|-----|----|----|
| 首页 | ✅ | ✅ | ✅ |
| 帐管 | ✅ | ✅ | ✅ |
| 报表 | ✅ | ✅ | ✅ |
| 即时注单 | ✅ | ✅ | ✅ |
| 注单管理 | ✅ | ✅ | ✅ |
| 操盘 | ✅ | ✅ | ❌（无） |
| 日志 | ✅ | ✅ | ❌（无） |
| 系统设置 | ✅ | ✅ | ❌（无） |
| **合计** | **8 个** | **8 个** | **5 个** |

注单管理子项可见性（实测左菜单展开后）：

| 子项 ID | ADS | AD | D0 | CO | SU | AG |
|----------|-----|----|----|----|----|----|
| `bet_list` 流水注单 | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| `bet_edit` 改单注单 | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| `bet_abnormal` 异常注单 | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| `bet_live_dangerous` 滚球危险球 | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |

> **D0 缺 `bet_edit`**：分公司只能查注单，不能改单。
> **CO/SU/AG 整个注单管理菜单都不出现** — `/agents/` 新版 UI 不暴露这类操作（改/撤注单只允许公司层做）。

下线状态卡片支持的层级：

| 主帐号层 | 下线状态可切 | 实测截图 |
|----------|--------------|----------|
| ADS | 公司 / 分公司 / 股东 / 总代理 / 代理 / 会员 | `probe_after_ads_abu777.png` |
| AD | 分公司 / 股东 / 总代理 / 代理 / 会员 | `probe_after_ad_admin1.png` |
| D0 | 股东 / 总代理 / 代理 / 会员 | `probe_after_d0_d010101.png` |

帐户概况卡片字段差异：

| 字段 | ADS | AD | D0 |
|------|-----|----|----|
| 本期新公司数 | ✅ | ❌ | ❌ |
| 本期新分公司数 | ✅ | ✅ | ❌ |
| 本期新股东数 | ✅ | ✅ | ❌ |
| 本期新总代理数 | ✅ | ✅ | ❌ |
| 本期新代理数 | ✅ | ✅ | ❌ |
| 本期新会员数 | ✅ | ✅ | ❌ |
| 信用额度 / 剩余额度 | ❌ | ❌ | ✅ |
| 最后登入日期 | ❌ | ❌ | ✅ |
| 密码最后更新日期 | ❌ | ❌ | ✅ |

> ADS/AD 视角是"平台运营商"，关注新增帐号数；D0 视角是"渠道商"，关注自己额度与登入历史。

绩效概况"赢/输/获利率/实货量"对所有三层都有，但 D0 还显示"占成收入"模块；ADS/AD 不显示该模块。

#### 17.4.2 新版（`/agents/` CO / SU / AG）

参考截图：`@/Volumes/T7/Crown-gold/.notes/probe_after_co_d111111.png`、`@/Volumes/T7/Crown-gold/.notes/probe_after_su_d222222.png`、`@/Volumes/T7/Crown-gold/.notes/probe_after_ag_sealin11.png`、`@/Volumes/T7/Crown-gold/.notes/probe_sidebar_co_d111111.png`、`@/Volumes/T7/Crown-gold/.notes/probe_sidebar_su_d222222.png`、`@/Volumes/T7/Crown-gold/.notes/probe_sidebar_ag_sealin11.png`。

**共同结构（实测）**：
- 顶栏：左 `≡ #mu_hab` 汉堡 + 右侧 3–4 个操作按钮。
- 中央自上而下：3 个大黑按钮（**报表 / 帐号管理 / 即时注单**）→ KPI 大字（获利率 / 赢-输 / 实货量 + "0% 比前一天增加" 趋势线）→ 帐号概况 + 下线状态（甜甜圈图）→ 占成收入图表。
- 侧滑菜单（点 `≡` 后从左侧滑出）：**首页 / 报表 / 帐号管理（含子菜单）/ 即时注单 / 注单监视视窗**。

**顶栏操作按钮（实测）**：

| Layer | 操作按钮组 | 按钮数 |
|-------|-----------|--------|
| CO（登 1） | **新总代 · 搜帐号 · 在线客服** | 3 |
| SU（登 2） | **新代理 · 搜帐号 · 在线客服 · 公告** | 4 |
| AG（登 3） | **新会员 · 搜帐号 · 在线客服 · 公告** | 4 |

> 规则：第一个按钮总是"**新增直接下级**"（CO→新总代、SU→新代理、AG→新会员）；"公告"按钮在 SU/AG 顶部显示，CO 不显示。"搜帐号" 是文字按钮，相当于经典版的"快速搜索"，但只在 `/agents/` 里出现。

**侧滑菜单内容（实测点 `≡` 后）**：

| 一级菜单 | CO（登 1） | SU（登 2） | AG（登 3） |
|----------|------------|------------|------------|
| 首页 | ✅ | ✅ | ✅ |
| 报表 | ✅ | ✅ | ✅ |
| **帐号管理** ↳ 子菜单 | 总代理 / 代理商 / 会员 / 子帐号 | 代理商 / 会员 / 子帐号 | 会员 / 子帐号 |
| 即时注单 | ✅ | ✅ | ✅ |
| 注单监视视窗 | ✅ | ✅ | ✅ |
| 操盘 | ❌ | ❌ | ❌ |
| 日志 | ❌ | ❌ | ❌ |
| 系统设置 | ❌ | ❌ | ❌ |

> **关键**：`/agents/` 整套菜单没有 `操盘 / 日志 / 系统设置` 三段（与经典版相比），用语也不同 —— 经典版叫"**注单管理**"在 `/agents/` 改名为"**注单监视视窗**"。帐号管理子项数量随层级递减（CO 4 项 → SU 3 项 → AG 2 项），都不含上级层（每层只看到自己往下的）。

**下线状态甜甜圈图 toggle**：

| 主帐号层 | 可切层级 |
|----------|----------|
| CO（登 1） | 总代理 / 代理商 / 会员（3 个） |
| SU（登 2） | 代理商 / 会员（2 个） |
| AG（登 3） | 会员（1 个） |

**帐号概况字段**（CO/SU/AG 共有）：信用额度、剩余额度、本期新会员数、本期日期段（如 `2024/12/30 - 2025/1/26`）、本期剩余天数、本期完成天数、最后登入时间、密码最后更新时间。

**绩效概况**（共有）：昨天 / 上周 / 本期切换 + 获利率 / 赢-输 / 实货量 三个大字 + "比前一天增加 X%" 趋势横条。

**占成收入**（AG 实测可见，CO/SU 也有但不在首屏首图）：本期"占成收入"曲线图。

#### 17.4.3 顶部 / 右侧个人面板差异（实测可见性矩阵）

✅ = `offsetParent !== null`（DOM 在且 CSS 可见）；❌ = 节点不存在 或 `display:none`。

| ID | 中文 | ADS | AD | D0 | CO | SU | AG |
|----|------|-----|----|----|----|----|----|
| `mu_hab` 汉堡 | 顶 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `mu_profile` 头像 | 顶 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `mu_announcement` 公告铃 | 顶 | ✅ | ✅ | ✅ | ❌（实测当时无未读） | ✅ | ✅ |
| `page_name` 页面名 | 顶 | ✅ | ✅ | ✅ | ❌（新版用按钮替代） | ❌ | ❌ |
| `quick_search` 快速搜索 | 顶 | ✅ | ✅ | ✅ | ✅（新版叫"搜帐号"） | ✅ | ✅ |
| `wmc` 实时注单图标 | 顶 | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| `live_chat` 客服 | 顶 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `user_code` 当前帐号 | 右 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `chgPswd` 更改密码 | 右 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `pswdRec` 密码恢复 | 右 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `my_activities` 我的活动 | 右 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `contact` 联系我们 | 右 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `troubleshooting` 故障排除 | 右 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `feature` 特色 | 右 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `requirements` 系统需求 | 右 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `new_url` 最新网址 | 右 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `logOut` 登出 | 右 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **`mySetting` 我的设定** | 右 | ❌ | ❌ | **✅** | **✅** | **✅** | **✅** |
| **`choose_lan` 选择语言** | 右 | ❌ | ❌ | ❌ | **✅** | **✅** | **✅** |
| `bm_problem_li` 底部问题帐号 | 底 | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| `bm_announcement_li` 底部公告 | 底 | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| `bm_quick_search` 底部快搜 | 底 | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| `bm_live_chat` 底部客服 | 底 | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| `bm_wmc` 底部 WMC | 底 | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |

> **关键发现（实测）**：
> 1. **`mySetting`（我的设定）** 在 ADS / AD 上是占位状态（DOM 不可见），但在 D0 / CO / SU / AG 上完全可用。说明 ADS/AD 公司层故意不开放"我的设定"页。
> 2. **`choose_lan`（选择语言）** 只在 `/agents/`（CO/SU/AG）的新版 UI 上可见；经典版 ADS/AD/D0 锁定中文，没有语言切换。
> 3. **`page_name`（页面名/面包屑）** 是经典版顶栏特有元素；新版用顶部黑色按钮（报表/帐管/即时注单）替代了"当前在哪一页"的视觉提示。
> 4. **`wmc`**（顶部红色闪电图标）的 DOM 在所有经典版都可见（ADS/AD/D0），但在新版 CO/SU/AG 完全不存在 —— WMC 实时注单监控是公司/分公司专用工具，代理层用不到。
> 5. **`bm_*` 底部菜单** 5 个按钮都只在经典版的小屏断点上出现；新版自带响应式 dashboard，无需独立底部菜单。
> 6. **`mu_announcement`（公告铃）** 在 CO 测试帐号 `d111111` 当时显示不可见，是因为该帐号当时没有未读公告；铃铛是条件渲染。SU 与 AG 测试帐号有未读，所以铃铛可见。规则不是 layer 决定的，是"有未读公告才显示"。

### 17.5 子帐号差异（user_type=2）

实测 `Aa100000`（abu777 的子帐号，`isMaster=1`）：
- 响应 `login_layer="ads"`、`user_type=2`、`pri_type="A-B-B1-B2-C"`、`layer_id=1`（父）、`user_id=56`（自身）。
- 顶栏在线统计与父 abu777 完全一致（继承 layer_id=1 的视角）。
- 左侧菜单基于 `pri_type` 隐藏：未含 `A` 隐藏即时注单 / WMC；未含 `B*` 隐藏帐号管理 / 快速搜索 / 问题帐号；未含 `C` 隐藏报表。本例字符串包含全部 5 个，故菜单与主帐号一致。

> `pri_type` 检查在 `top_menu.js` 与 `left_menu.js` 中用字符串匹配实现（`pri_type.indexOf("A")` / `pri_type.match(/B[0-9aA-zZ]/)`）。

### 17.6 帐密查询规则（来自 `vendor/common/Login.php`）

| Layer | 表 | 主 WHERE 条件 |
|-------|----|---------------|
| `ads` / `ad` | `admin` | `name=<U> AND passwd=md5(<P>)`；level 由表内字段决定，不在 WHERE 里 |
| `d0` | `rank` | `name=<U> AND level=4 AND passwd=md5(<P>)` |
| `co` | `rank` | `name=<U> AND level=3 AND passwd=md5(<P>) AND (pwd_safe=<S> 或 pwd_safe IS NULL)` |
| `su` | `rank` | `name=<U> AND level=2 AND passwd=md5(<P>) AND (pwd_safe=<S> 或 pwd_safe IS NULL)` |
| `ag` | `rank` | **两步**：① `name=<U> AND loginname IS NULL AND level=1 AND passwd=md5(<P>)`；② 若 ① 无结果，改用 `loginname=<U> AND level=1` |

> AG（登 3）使用 `loginname` 字段作为"登入帐号"，与 `name`（用户帐号）分开。例如 rank.id=35 主键 `name=aa1aa10088` `loginname=sealin11`，登入用 `sealin11` 但 SPA 内部 `top.username="aa1aa10088"`。
> CO/SU（登 1/2）则不使用 `loginname`，登入直接用 `name`，再额外校验 `pwd_safe` 安全代码。

### 17.7 验证码机制

仅 ADS / AD / D0（即 `/admin/` 与 `/d0/`）需要数学验证码：

- 图片由 `<path>/verifycode.php` 生成（PHP GD），算式形如 `26+26=?`、`17*66=?`、`183/3=?`。
- 答案存入 PHP Session：`$_SESSION["<prefix>verifycode"]`。
- 部署版的 prefix = `"hrh"`（仓库默认 `"hg"`，实际服务端被改为 `"hrh"`）。
- 验证：`POST /transform.php` 时 `verifycode=<num>` 必须与 session 中保存的整数完全一致。
- 失败错误码：`0X001`（未填）/ `4X042`（填错）。
- 点击验证码图片会重新请求 `verifycode.php` 刷新答案。

`/agents/` 没有验证码，但有 **登入失败次数风控**：3 分钟内失败 ≥5 次会被锁 3 分钟（错误码 `4X006`）；累计错次记入 `rank.errnum`，过多则 `bandate` 设置定时禁登。

### 17.8 实测帐号清单（仅供调试本仓库部署）

> 帐号源自 `db_client.admin` 与 `db_client.rank` 表，已脱敏说明字段含义；密码为明文存储的 `pw` 列。

| Layer | 入口 | 帐号 | 密码 | 安全代码 | 备注 |
|-------|------|------|------|----------|------|
| ADS | `/admin/` | `abu777` | `Aa123456` | — | level=0 主超管 |
| AD | `/admin/` | `admin1` | `Aa123456` | — | level=1 主公司 |
| ADS 子 | `/admin/` | `Aa100000` | `Aa11223344` | — | abu777 的子帐号，pri 全开 |
| ADS 子 | `/admin/` | `Aa11111` | `Aa11223344` | — | abu777 的子帐号，pri 全开 |
| D0 | `/d0/` | `d010101` | `Aa12345678` | — | level=4 分公司 |
| CO（登 1） | `/agents/` 切到登入 1 | `d111111` | `Aa12345678` | `Aa123123` | level=3 股东 |
| SU（登 2） | `/agents/` 切到登入 2 | `d222222` | `Aa12345678` | `Aa123123` | level=2 总代 |
| AG（登 3） | `/agents/` 切到登入 3 | `sealin11` | `Sealin1226` | — | level=1 代理（用 loginname 登入；表中 name=`aa1aa10088`） |

`aa1002` / `aa123123`（AG）虽 `status=1` 但 `enddate` 已过期，登入返回 `4X035`；`d223333` 因有 `loginname=Aa8888` 必须用 `Aa8888` 而非 `d223333` 登入。

### 17.9 抓取手段（可重现的实测方法）

实测脚本与产物均在 `@/Volumes/T7/Crown-gold/.notes/` 下：

- `@/Volumes/T7/Crown-gold/.notes/login_probe.sh`：curl 实测 10 个帐号登入流程（含 captcha 自动读取）。
- `@/Volumes/T7/Crown-gold/.notes/probe_admins_v2.py`：Playwright 半自动登入 + 抓登入页表单 + 抓登入响应。
- `@/Volumes/T7/Crown-gold/.notes/probe_ui.py`：完整登入 + 截图 + 菜单可见性矩阵抓取，输出 `probe_ui.json`。
- `@/Volumes/T7/Crown-gold/.notes/probe_login_*.png`：6 套登入页截图。
- `@/Volumes/T7/Crown-gold/.notes/probe_after_*.png`：6 套登入后首页截图。
- `@/Volumes/T7/Crown-gold/.notes/probe_ui.json`：所有可见菜单 ID 的层级矩阵原始数据。

验证码读取依赖：`ssh -i Crowngold.pem ubuntu@3.25.180.205 'sudo cat /var/lib/php/sessions/sess_<PHPSESSID>'` → 抓取 `hrhverifycode|i:<N>;`。

---

## 18. 附录 A：常用语言键（`LS_cn.js`）

### A.1 页面标题
`page_dashboard 首页` / `page_report 报表` / `page_setting 系统设置` / `page_curl 采集设置` / `page_data 数据管理` / `page_totalbet 即时注单` / `page_match 操盘` / `page_bet 注单管理` / `page_set 有结果` / `page_un 未有结果` / `page_summary 赛事结果概要` / `page_period 月帐期数表` / `page_exchange 汇率` / `page_cancel 取消单` / `page_quicksearch 快速搜索` / `page_onlinemem 线上会员` / `page_onlineag 线上代理` / `page_onlinesu 线上总代` / `page_onlineco 线上股东` / `page_onlined0 线上分公司` / `page_onlinead 线上公司` / `page_mysetting 我的设定` / `page_myactivities 我的活动记录` / `page_feature 特色` / `page_requirements 系统需求` / `page_newurl 最新网址` / `page_contactus 联系我们` / `page_pwd_recovery 密码恢复` / `page_chg_pwd_inside 更改密码` / `page_problem_accounts 问题帐号` / `page_announcement 公告`

### A.2 新增帐号路径
`page_ad_add 新增公司` / `page_d0_add 新增分公司` / `page_co_add 新增股东` / `page_su_add 新增总代理` / `page_ag_add 新增代理` / `page_mem_add 新增会员` / `page_sub_add 新增子帐号`

### A.3 球类（顶部菜单 / 报表筛选）
`page_overview 总览` / `page_INPLAY 滚球` / `page_TODAY 今日` / `page_EARLY 早盘` / `page_STARTED 已开赛` / `page_PARLAY 过关` / `page_OUTRIGHT 冠军` / `page_RESULTS 赛果` / `page_MATCH 赛程` / `page_SCORE 比分`

### A.4 帐户状态
`enable_Y 启用` / `enable_N 停用` / `enable_S 只能看帐` / `enable_F 禁止登入`

### A.5 操作类型（日志）
`acc_str_credit 更改額度` / `acc_str_enable 更改帐户状态` / `acc_str_add 新增帐号` / `acc_str_beadd 此帐号被谁新增` / `acc_str_password 更改密码`

---

## 19. 附录 B：典型流程示例

### B.1 新增一个会员
1. 左菜单 → **帐户管理 → 会员**。
2. 选定上级代理商（顶部下拉 `sel_upper_box`）。
3. 点右上 **新增会员 `btn_add_acc`**。
4. 在"用户详细设定"填帐号、名称、密码、登入帐号。
5. 选额度模式（自动恢复 / 余额浮动），输入信用额度。
6. 切到"退水设定"分页，按球类填退水百分比。
7. 切到"占成设定"分页（若有），确认占成比例。
8. 点 **保存**；成功后弹复制帐密浮层 → 点 **COPY** 保存到剪贴板。
9. 列表自动刷新显示新帐号。

### B.2 查看某代理报表并下钻
1. 左菜单 → **报表 → 注单报表**。
2. 顶部选 **有结果** + 日期范围 + 球类 + 占成视角。
3. 点 **刷新**；表格出现"代理商汇总"。
4. 点击某代理行 → 进入其总代汇总 → 再点进股东 → 再点进会员 → 最后点进注单流水。
5. 点单笔注单 `tid_*` 箭头查看完整详情。
6. 右上 **打印 / 导出 Excel** 保存留档。

### B.3 处理一笔异常注单
1. 顶部铃铛或左菜单 **注单管理 → 异常注单**。
2. 顶部异常类型下拉选"高赔率追单"。
3. 点单笔 **取消注单** → 弹出取消原因下拉 → 选 `赛事腰斩` → 点 **确认**。
4. 系统重算占成 / 退水，目标会员收到通知，操作员日志记入。

### B.4 改赛果
1. 左菜单 **即时注单 → 赛果** 或 **操盘 → 比分**。
2. 找到目标比赛行，点 **改赛果**。
3. 在浮层填全场比分、半场比分、加时、点球 → **保存**。
4. 二次确认后系统自动重算所有相关注单，相关会员余额刷新。
5. 日志记录"改赛果"动作 + 原值/新值差异。

---

## 20. 附录 C：路径与文件对应

| URL 路由 | 模板 | JS 控制器 |
|----------|------|-----------|
| `dashboard_main` | — | `body/dashboard_main.js` + `body/dashboard.js` |
| `acc_*_list` | `acc/*/acc_*_list.html` | `body/acc/acc_*_list.js` |
| `acc_*_add` | `acc/*/acc_*_add.html` + `acc_*_comm.html` | `body/acc/acc_*_add.js` |
| `acc_*_detail` | `acc/*/acc_*_detail.html` | `body/acc/acc_*_detail.js` |
| `report_main` | `report/report_main.html` | `body/report/report_main.js` |
| `report_list_bet` | `report/report_list_bet.html` | `body/report/report_list_bet.js` |
| `totalbet_header` | `op/OP_*.html` | `body/op/*.js` |
| `bet_header` | `bet/bet_index.html`, `bet/bet_edit_index.html` | `body/bet/*.js` |
| `match_header` | `match/match_*.html` | `body/match/*.js` |
| `log_*` | `log/log_*.html` | `body/log/log_*.js` |
| `quick_search` | `acc/acc_quicksearch.html` | `body/acc/quick_search.js` |
| `announcement` | `ann/ann_*.html` | `body/ann/*.js` |
| `my_activities` | `log/log_record.html` | `body/my/my_activities.js` |
| `chg_pwd_inside` | `other/chg_pwd_inside.html` | `body/other/chg_pwd_inside.js` |
| `setting_*` | `setting/setting_*.html` | `body/setting/*.js` |
| `online_*` | `acc/acc_onlineMem.html` | `body/online/*.js` |

底层公共库：
- `static/<role>/js/lib/util.js`：DOM 工具、事件、Cookie、Localstorage、HTTP 封装。
- `static/<role>/js/lib/HttpRequest.js` + `HttpRequestRetry.js`：服务端通信，自动带 Session token。
- `static/<role>/js/lib/calendar.js`：日期控件。
- `static/<role>/js/lib/Chart.js` + `chartJs.js`：仪表板图表。
- `static/<role>/js/lib/fastTemplate.js`：模板渲染（`*ID*` 占位符替换）。
- `static/<role>/js/lib/CookieManager.js` / `LocalstorageManager.js`：会话/偏好持久化。

---

> 文档生成时间：根据当前仓库 `wwwroot_F5PEa/` 内容整理。如界面新增字段或路由，请同步更新本手册。
