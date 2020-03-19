


export interface RequestData {
  userOpenId: string,             //此技能中用户唯一标识，在线测试不携带
  deviceOpenId: string,           //此技能中天猫精灵设备唯一标识，在线测试不携带
  city: string                    //天猫精灵设备所处的城市，在线测试不携带
}

export interface SlotEntity {
  intentParameterId: number;//	Long	意图参数 ID	是
  intentParameterName: String;//	String	意图参数名	是
  originalValue: string;//	String	原始句子中抽取出来的未做处理的 slot 值	是
  standardValue: string;//	String	原始 slot 归一化后的值	是
  liveTime: number;//	Integer	该 slot 已生存时间（会话轮数）	是
  createTimeStamp: number;//	Long	该 slot 产生的时间点	是
}

export interface iReqBody {
  sessionId: string;	//String	会话 ID，session内的对话此 ID 相同	是
  botId: number;//	Long	应用 ID，天猫精灵设备绑定的应用	是
  utterance: string;//	进入意图时用户所说的语句	是
  skillId: number;//	Long	技能 ID	是
  skillName: string;//	String	技能名称	是
  intentName: string;//	String	意图标识	是
  token?: string;//	String	技能授权配置 OAuth2.0 授权并且用户登录授权账号后可以得到此 token，详细请查看 OAuth2.0 配置文档，在线测试不携带	否
  requestData?: RequestData;//	Map < String, String > 附带参数, 使用天猫精灵设备调用技能时额外携带的信息	否
  slotEntities: SlotEntity[];//	List	从用户语句中抽取出的 slot 参数信息	是
  domainId?: number;//	Long	领域 ID	是
  intentId?: string;//	Long	意图 ID	是
}

/**
 * 返回的结构体
 */
export interface iResBody {
  returnCode: string//	String	"0"默认表示成功，其他不成功的字段自己可以确定	是
  returnErrorSolution?: string;//	String	出错时解决办法的描述信息	否
  returnMessage?: string//	String	返回执行成功的描述信息	否
  returnValue: ReturnValue;//		意图理解后的执行结果	是
}

export interface ReturnValue {
  reply: string;//	String	回复播报语句	是
  resultType: string//;	String	回复时的状态标识（ASK_INF：信息获取，例如"请问您要查新哪个城市？"，在此状态下，用户说的下一句话优先进入本意图进行有效信息抽取  RESULT：正常完成交互的阶段并给出回复  CONFIRM：期待确认）	是
  properties?: any;//	Map < String, String > 生成回复语句时携带的额外信息	否
  askedInfos?: AskedInfoMsg[];//	List	本次追问的具体参数名（开发者平台意图参数下配置的参数信息），resultType 需要设置为：ASK_INF	否
  actions?: Action[];//	List	播控类信息，目前只支持播放音频	否
  executeCode: string;//	String	“SUCCESS”代表执行成功；“PARAMS_ERROR”代表接收到的请求参数出错；“EXECUTE_ERROR”代表自身代码有异常；“REPLY_ERROR”代表回复结果生成出错
}

export interface AskedInfoMsg {
  parameterName: string;//	String	询问的参数名（非实体名）	是
  intentId: string;//	Long	意图 ID，从请求参数中可以获得	是
}

export interface Action {
  name: string;//	String	Action 名称，该名字必须设置为“audioPlayGenieSource”	是
  properties: any;//	Map<String,String>	Action 中的携带信息的集合，必要的key：“audioGenieId”，value 为该技能下音频素材库内的音频 ID	是
}
