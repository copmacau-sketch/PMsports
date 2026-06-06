<?
function  get_other_ioratio($odd_type, $iorH, $iorC , $showior){
	if($iorH!="" ||$iorC!=""){
		$out =chg_ior($odd_type,$iorH,$iorC,$showior);
	}else{
		$out[0]=$iorH;
		$out[1]=$iorC;
	}
	return $out;
}
/**
 * 转换赔率
 * @param odd_f
 * @param $H_ratio
 * @param $C_ratio
 * @param showior
 * @return
 */
function chg_ior($odd_f,$iorH,$iorC,$showior){
	if($iorH < 3) $iorH *=1000;
	if($iorC < 3) $iorC *=1000;
	
	switch($odd_f){
	case "H":	//香港盘
		$ior = get_HK_ior($iorH,$iorC);
		break;
	case "M":	//马来盘
		$ior = get_MA_ior($iorH,$iorC);
		break;
	case "I" :	//欧洲盘
		$ior = get_IND_ior($iorH,$iorC);
		break;
	case "E":	//印尼盘
		$ior = get_EU_ior($iorH,$iorC);
		break;
	default:	//香港盘
		$ior[0]=$iorH ;
		$ior[1]=$iorC ;
	}
	$ior[0]=number_format(intval($ior[0]/10)/100,3,'.','');
	$ior[1]=number_format(intval($ior[1]/10)/100,3,'.','');
	
	return $ior;
}

/**
 * 换算成输水盘赔率
 * @param $H_ratio
 * @param $C_ratio
 * @return
 */
function get_HK_ior( $H_ratio, $C_ratio){
	if ($H_ratio <= 1000 && $C_ratio <= 1000){
		$out_ior[0]=$H_ratio;
		$out_ior[1]=$C_ratio;
		return $out_ior;
	}
	$line=2000 - ( $H_ratio + $C_ratio );
	if ($H_ratio > $C_ratio){ 
		$lowRatio=$C_ratio;
		$nowType = "C";
	}else{
		$lowRatio = $H_ratio;
		$nowType = "H";
	}
	if (((2000 - $line) - $lowRatio) > 1000){
		//对盘马来盘
		$nowRatio = ($lowRatio + $line) * (-1);
	}else{
		//对盘香港盘
		$nowRatio=(2000 - $line) - $lowRatio;	
	}
	if ($nowRatio < 0){
		$highRatio = abs(1000 / $nowRatio) * 1000;
	}else{
		$highRatio = (2000 - $line - $nowRatio) ;
	}
	if ($nowType == "H"){
		$out_ior[0]=$lowRatio;
		$out_ior[1]=$highRatio;
	}else{
		$out_ior[0]=$highRatio;
		$out_ior[1]=$lowRatio;
	}
	return $out_ior;
}
/**
 * 换算成马来盘赔率
 * @param $H_ratio
 * @param $C_ratio
 * @return
 */
function get_MA_ior( $H_ratio, $C_ratio){
	//var $out_ior=new Array();
	if (($H_ratio <= 1000 && $C_ratio <= 1000)){
		$out_ior[0]=$H_ratio;
		$out_ior[1]=$C_ratio;
		return $out_ior;
	}
	$line=2000 - ( $H_ratio + $C_ratio );
	if ($H_ratio > $C_ratio){ 
		$lowRatio = $C_ratio;
		$nowType = "C";
	}else{
		$lowRatio = $H_ratio;
		$nowType = "H";
	}
	$highRatio = ($lowRatio + $line) * (-1);
	if ($nowType == "H"){
		$out_ior[0]=$lowRatio;
		$out_ior[1]=$highRatio;
	}else{
		$out_ior[0]=$highRatio;
		$out_ior[1]=$lowRatio;
	}
	return $out_ior;
}
/**
 * 换算成印尼盘赔率
 * @param $H_ratio
 * @param $C_ratio
 * @return
 */
function get_IND_ior( $H_ratio, $C_ratio){
	//var $out_ior=new Array();
	$out_ior = get_HK_ior($H_ratio,$C_ratio);
	$H_ratio=$out_ior[0];
	$C_ratio=$out_ior[1];
	$H_ratio /= 1000;
	$C_ratio /= 1000;
	if($H_ratio < 1){
		$H_ratio=(-1) / $H_ratio;
	}
	if($C_ratio < 1){
		$C_ratio=(-1) / $C_ratio;
	}
	$out_ior[0]=$H_ratio*1000;
	$out_ior[1]=$C_ratio*1000;
	return $out_ior;
}
/**
 * 换算成欧洲盘赔率
 * @param $H_ratio
 * @param $C_ratio
 * @return
 */
function get_EU_ior($H_ratio, $C_ratio){
	//var $out_ior=new Array();
	$out_ior = get_HK_ior($H_ratio,$C_ratio);
	$H_ratio=$out_ior[0];
	$C_ratio=$out_ior[1];       
	$out_ior[0]=$H_ratio+1000;
	$out_ior[1]=$C_ratio+1000;
	return $out_ior;
}




function maxgold($top,$rate){

	return $rate<=1?$top:intval(($top/($rate*100))*100);

}

/**
 * 赛事时间换算
 * @param $dtime
 * @return string
 */
function match_start($dtime){
    $dtime=strtoupper($dtime);
    $mdate=explode('<BR>',strtoupper($dtime));
    $m_date=$mdate[0];
    $m_time=strtolower($mdate[1]);
    $hhmmstr=explode(":",$m_time);
    $hh=$hhmmstr[0];
    $ap=substr($m_time,strlen($m_time)-1,1);

    if (strtoupper($ap)=='P' and $hh<>12){
        $hh+=12;
    }

    $dd=explode("-",$m_date);
    if($dd[0]<>12 and date('m')==12){
        $yy=date('Y')+1;
    }else{
        $yy=date('Y');
    }
    $timestamp = $yy."-".$m_date." ".$hh.":".substr($hhmmstr[1],0,strlen($hhmmstr[1])-1).":00";
    return $timestamp;
}

?>