export default new class {
	String(Original){
		return this.Type(Original , 'string');
	}
	Number(Original){
		if(window.Number.isNaN(Original)) return false;
		return this.Type(Original , 'number');
	}
	Array(Original){
		return this.Type(Original , 'array');
	}
	Object(Original){
		if(this.Null(Original)) return false;
		return this.Type(Original , 'object');
	}
	Function(Original){
		return this.Type(Original , 'function');
	}
	Boolean(Original){
		return this.Type(Original , 'boolean');
	}
	Undefined(Original){
		return this.Type(Original , 'undefined');
	}
	Null(Original){
		return this.Type(Original , 'null');
	}
	Nan(Original){
		return this.Type(Original , 'nan');
	}
	Promise(Original){
		return this.Type(Original , 'promise');
	}
	Type(Original , Method){
		if(this.Confirm(typeof Method , 'object')){
			if(this.In(Method , 'nan') && isNaN(Original)) return true;
			if(this.In(Method , 'null') && this.Confirm(Original , null)) return true;
			if(this.In(Method , 'array') && window.Array.isArray(Original)) return true;
			if(this.In(Method , typeof Original)) return true;
			return false;
		}
		if(this.Confirm(Method , 'nan') && isNaN(Original)) return true;
		if(this.Confirm(Method , 'null') && this.Confirm(Original , null)) return true;
		if(this.Confirm(Method , 'array') && window.Array.isArray(Original)) return true;
		if(this.Confirm(Method , typeof Original)) return true;
		return false;
	}
	Empty(Original){
		if(this.Function(Original)) return false;
		if(this.Undefined(Original)) return true;
		if(this.Null(Original)) return true;
		if(this.Number(Original)) return false;
		if(this.Boolean(Original) && Original) return false;
		if(this.Object(Original) && this.Min(Original , 1)) return false;
		if(this.String(Original) && !this.Confirm(Original , '')) return false;
		return true;
	}
	In(Original , Value){
		if(this.Empty(Value)) return false;
		if(this.Object(Original) && !this.Array(Original)) Original = App.Object.Value(Original);
		if(!this.Array(Original)) Original = App.String.Convert(Original);
		if(!this.Array(Value)) return Original.includes(Value);
		let Boolean = true;
		App.Each.Of(Value , Item => {
			if(Boolean && !Original.includes(Item)) Boolean = false;
			return Boolean;
		});
		return Boolean;
	}
	Confirm(Original , Value){
		return window.Object.is(Original , Value);
	}
	Require(Original , Method){
		if(this.Undefined(Method)) Method = ['string' , 'array' , 'object' , 'number' , 'boolean'];
		if(!this.Type(Original , Method) || this.Empty(Original)) return false;
		return true;
	}
	With(Original , Value){
		if(this.Require(Original) && this.Require(Value)) return true;
		return false;
	}
	Without(Original , Value){
		if(!this.Require(Original) && this.Require(Value)) return true;
		return false;
	}
	Same(Original , Value , Item){
		if(this.Confirm(Original , Value) && this.Require(Item)) return true;
		return false;
	}
	Length(Original , Size){
		return this.Eq(App.Length(Original) , Size);
	}
	Min(Original , Size){
		return this.Egt(App.Length(Original) , Size);
	}
	Max(Original , Size){
		return this.Elt(App.Length(Original) , Size);
	}
	Range(Original , Min , Max){
		return this.Between(App.Length(Original) , Min , Max);
	}
	Eq(Original , Value){
		if(App.Number.Convert(Original) === App.Number.Convert(Value)) return true;
		return false;
	}
	Gt(Original , Value){
		if(App.Number.Convert(Original) > App.Number.Convert(Value)) return true;
		return false;
	}
	Lt(Original , Value){
		if(App.Number.Convert(Original) < App.Number.Convert(Value)) return true;
		return false;
	}
	Egt(Original , Value){
		if(App.Number.Convert(Original) >= App.Number.Convert(Value)) return true;
		return false;
	}
	Elt(Original , Value){
		if(App.Number.Convert(Original) <= App.Number.Convert(Value)) return true;
		return false;
	}
	Between(Original , Min , Max){
		if(this.Egt(Original , Min) && this.Elt(Original , Max)) return true;
		return false;
	}
	Match(Original , Rule){
		if(!this.Array(Rule)) return Rule.test(Original);
		let Boolean = true;
		App.Each.Of(Rule , Item => {
			if(Boolean && !Item.test(Original)) Boolean = false;
			return Boolean;
		});
		return Boolean;
	}
	Email(Original){
		return this.Match(Original , /^\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}$/);
	}
	Url(Original){
		return this.Match(Original , /^((https|http|ftp|rtsp|mms|ws|wss|svn)?:\/\/)[^\s]+/);
	}
	Phone(Original){
		return this.Match(Original , /^(([0-9]{3,4})-)?([0-9]{7,8})(-([0-9]{3}))?$/);
	}
	Mobile(Original){
		return this.Match(Original , /^(13[0-9]|14[57]|15[012356789]|17[678]|18[0-9]|19[0-9])[0-9]{8}$/);
	}
	Integer(Original){
		return this.Match(Original , /^(-)?[0-9]+$/);
	}
	Decimal(Original){
		return this.Match(Original , /^(\-)?[0-9]+\.[0-9]+$/);
	}
	Negative(Original){
		if(this.Eq(App.Number.Convert(Original) , window.Math.abs(Original))) return false;
		return true;
	}
	NaturalNumber(Original){
		if(this.Integer(Original) || this.Decimal(Original) || !this.Negative(Original)) return true;
		return false;
	}
	PositiveInteger(Original){
		if(!this.Integer(Original) || this.Negative(Original)) return false;
		return true;
	}
	Chs(Original){
		return this.Match(Original , /^[\u4e00-\u9fa5]+$/);
	}
	Alpha(Original){
		return this.Match(Original , /^([a-zA-Z])+$/);
	}
	AlphaNumber(Original){
		return this.Match(Original , /^[a-zA-Z0-9]+$/);
	}
	AlphaChs(Original){
		return this.Match(Original , /^[a-zA-Z\u4e00-\u9fa5]+$/);
	}
	AlphaDesh(Original){
		return this.Match(Original , /^([a-zA-Z-_])+$/);
	}
	AlphaNumberDesh(Original){
		return this.Match(Original , /^[a-zA-Z0-9-_]+$/);
	}
	AlphaNumberChs(Original){
		return this.Match(Original , /^[a-zA-Z0-9\u4e00-\u9fa5]+$/);
	}
	AlphaChsDesh(Original){
		return this.Match(Original , /^[a-zA-Z\u4e00-\u9fa5-_]+$/);
	}
	AlphaNumberChsDesh(Original){
		return this.Match(Original , /^[a-zA-Z0-9\u4e00-\u9fa5-_]+$/);
	}
	Ip(Original){
		if(this.Ipv4(Original) || this.Ipv6(Original)) return true;
		return false;
	}
	Ipv4(Original){
		return this.Match(Original , /^([0-9]|[1-9]\d{1}|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9]\d{1}|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9]\d{1}|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9]\d{1}|1\d\d|2[0-4]\d|25[0-5])$/);
	}
	Ipv6(Original){
		return this.Match(Original , /((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))[%\.\+/]?/);
	}
	License(Original , Value){
		if(!this.Match(Original , /^[京津冀晋蒙辽吉黑沪苏浙皖闽赣鲁豫鄂湘粤桂琼川贵云渝藏陕甘青宁新]{1}[a-zA-Z]{1}[0-9a-zA-Z]{5}$/)) return false;
		if(!this.Require(Value , 'string')) return true;
		return this.In(Original , Value);
	}
	Card(Original){
		if(!this.Match(Original , /^([0-9]{6})(19|20)?([0-9]{9})([0-9]{1}|X)?$/)) return false;
		const Option = {};
		Option.City = {
			11 : '北京' , 12 : '天津' , 13 : '河北' , 14 : '山西' , 15 : '内蒙古' ,
			21 : '辽宁' , 22 : '吉林' , 23 : '黑龙江' ,
			31 : '上海' , 32 : '江苏' , 33 : '浙江' , 34 : '安徽' , 35 : '福建' , 36 : '江西' , 37 : '山东' ,
			41 : '河南' , 42 : '湖北' , 43 : '湖南' , 44 : '广东' , 45 : '广西' ,  46 : '海南' ,
			50 : '重庆' , 51 : '四川' , 52 : '贵州' , 53 : '云南' , 54 : '西藏' ,
			61 : '陕西' , 62 : '甘肃' , 63 : '青海' , 64 : '宁夏' ,  65 : '新疆' ,
			71 : '台湾' ,
			81 : '香港' , 82 : '澳门' ,
			91 : '国外' ,
		};
		Option.Factor = [7 , 9 , 10 , 5 , 8 , 4 , 2 , 1 , 6 , 3 , 7 , 9 , 10 , 5 , 8 , 4 , 2];
		Option.Parity = [1 , 0 , 'X' , 9 , 8 , 7, 6 , 5 , 4 , 3 , 2];
		Option.Sum = 0;
		Option.Array = App.String.Split(Original);
		if(!this.String(Option.City[App.String.Substr(Original , 0 , 2)])) return false;
		if(!this.Length(Original , 18)) return false;
		App.Each.In(Option.Array , (Value , Index) => {
			if(this.Eq(Index , 17)) return false;
			Option.Sum = App.Calculate.Add(Option.Sum , App.Calculate.Mul(Value , Option.Factor[Index]));
			return true;
		});
		Option.Finally = Option.Parity[App.Calculate.Cop(Option.Sum , 11)];
		return this.Confirm(App.String.Convert(Option.Finally) , App.String.Convert(Option.Array[17]));
	}
	Date(Original){
		if(this.PositiveInteger(Original)) Original = App.String.Pad(Original , 13 , 0).End;
		if(this.Nan(window.Date.parse(Original)) && this.Nan((new window.Date(App.Number.Convert(Original))))) return false;
		return true;
	}
	DateBefore(Original , Value){
		if(!this.Date(Original) || !this.Date(Value)) return false;
		return this.Lt(App.Date.Time(Original) , App.Date.Time(Value));
	}
	DateAfter(Original , Value){
		if(!this.Date(Original) || !this.Date(Value)) return false;
		return this.Gt(App.Date.Time(Original) , App.Date.Time(Value));
	}
	Leap(Original){
		if(!this.Date(Original)) return false;
		return this.Eq(App.Calculate.Cop(App.Date.Year(Original) , 4) , 0);
	}
	Wap(){
		let Boolean = true;
		App.Each.Of(['android' , 'ipad' , 'iphone' , 'linux' , 'sysmbianos' , 'mobile' , 'windows phone'] , Item => {
			if(Boolean && this.In(App.String.Lower(window.navigator.userAgent) , Item)) Boolean = false;
			return Boolean;
		});
		return !Boolean;
	}
	Ios(){
		if(!this.Wap()) return false;
		let Boolean = false;
		App.Each.Of(['iphone' , 'ipad' , 'ipod'] , Item => {
			if(!Boolean && this.In(App.String.Lower(window.navigator.userAgent) , Item)) Boolean = false;
			return Boolean;
		});
		return !Boolean;
	}
	Android(){
		if(!this.Wap() || this.Ios()) return false;
		return true;
	}
	Pad(){
		if(!this.Wap() || !this.Lt(window.screen.width , 1440)) return false;
		return true;
	}
	Wx(){
		return this.In(App.String.Lower(window.navigator.userAgent) , 'micromessenger');
	}
	Ali(){
		return this.In(App.String.Lower(window.navigator.userAgent) , 'alipay');
	}
	Transverse(){
		if(this.Wap() && this.In([90 , -90] , window.orientation)) return true;
		if(this.Gt(window.screen.width , window.screen.height)) return true;
		return false;
	}
	Vertical(){
		if(this.Wap() && this.In([0 , 180] , window.orientation)) return true;
		if(this.Lt(window.screen.width , window.screen.height)) return true;
		return false;
	}
}