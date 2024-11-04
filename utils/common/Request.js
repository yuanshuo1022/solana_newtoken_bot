module.exports=  new class {
	#Type = [
		false ,
		'application/x-www-form-urlencoded;charset=UTF-8' ,
		'application/json;charset=UTF-8' ,
		'multipart/form-data;charset=UTF-8' ,
		'text/html;charset=UTF-8' ,
		'text/plain;charset=UTF-8' ,
		'text/xml;charset=UTF-8' ,
		'application/octet-stream' ,
	];
	#Make(Option){
		if(App.Verify.Array(Option)){
			const Response = [];
			App.Each.Of(Option , Item => {
				App.Array.Push(Response , this.#Make(Item)[0]);
				return true;
			});
			return Response;
		}else{
			const Response = {};
			Response.url = App.Check(Option.Url , 'String' , window.location.origin);
			if(App.Verify.Require(Option.Query , 'object')) Response.url = App.String.Concat(Response.url , (App.Verify.Eq(App.String.Find.Start(Response.url , '?') , -1) ? '?' : '&') , App.Object.Url(Option.Query));
			Response.contentType = this.#Type[App.Check(Option.Type , ['PositiveInteger' , 'Between'] , 2 , ['' , [0 , 7]])];
			Response.processData = (App.Verify.In([this.#Type[0] , this.#Type[3]] , Response.contentType) ? false : App.Check(Option.Process , 'Boolean' , true));
			Response.async = App.Check(Option.Async , 'Boolean' , true);
			Response.cache = App.Check(Option.Cache , 'Boolean' , true);
			Response.ifModified = App.Check(Option.Modified , 'Boolean' , false);
			Response.dataType = App.Check(Option.Mold , 'String' , 'json');
			Response.type = (App.Verify.String(Option.Method) && App.Verify.In(['get' , 'post' , 'put' , 'delete'] , App.String.Lower(Option.Method)) ? Option.Method : 'get');
			Response.timeout = App.Calculate.Mul(App.Check(Option.Timeout , 'PositiveInteger' , 30) , 1000);
			if(App.Verify.Function(Option.Before)) Response.beforeSend = Option.Before;
			if(App.Verify.Require(Option.Header , 'object')) Response.beforeSend = Xhr => {
				if(App.Verify.Function(Option.Before)) Option.Before(Xhr);
				App.Each.In(Option.Header , (Item , Index) => {
					Xhr.setRequestHeader(Index , Item);
					return true;
				});
			};
			if(App.Verify.Function(Option.Speed)) Response.xhr = () => {
				const Xhr = App.$.ajaxSettings.xhr();
				if(Xhr.upload) Xhr.upload.onprogress = Value => {
					Option.Speed(App.Calculate.Mul(App.Calculate.Div(Value.loaded , Value.total) , 100));
				};
				return Xhr;
			};
			if(App.Verify.Function(Option.Filter)) Response.dataFilter = Option.Filter;
			if(App.Verify.Function(Option.Error)) Response.error = (Xhr , Status , Exception) => {
				const Message = (App.Verify.Confirm(App.String.Lower(Xhr.statusText) , 'ok') ? Xhr.responseText : Exception);
				if(App.Verify.Function(Option.Error)) Option.Error(Message);
			}
			if(App.Verify.Function(Option.Complete)) Response.complete = Option.Complete;
			if(App.Verify.Function(Option.Success)) Response.success = Option.Success;
			Response.data = (() => {
				if(!App.Verify.Object(Option.Data)) Option.Data = {};
				if(App.Verify.Empty(Option.Data) || !App.Verify.In([this.#Type[0] , this.#Type[2] , this.#Type[3]] , Response.contentType)) return Option.Data;
				if(App.Verify.Confirm(this.#Type[0] , Response.contentType)){
					const Data = new FormData();
					App.Each.In(Option.Data , (Value , Index) => {
						Data.append(Index , Value);
						return true;
					});
					return Data;
				}else if(App.Verify.Confirm(this.#Type[2] , Response.contentType)){
					return App.Object.Json(Option.Data);
				}else if(App.Verify.Confirm(this.#Type[3] , Response.contentType)){
					return App.Object.Url(Option.Data);
				}
			})();
			return [Response];
		}
	}
	Ajax(Original){
		return Promise.all(this.#Make(Original).map(Item => App.$.ajax(Item))).then(Data => {
			if(App.Verify.Length(Data , 1)) return Data[0];
			return Data;
		});
	}
	Get(Original){
		if(App.Verify.String(Original)) return this.Ajax({
			Url : Original ,
			Method : 'get' ,
		});
		if(App.Verify.Array(Original)){
			const Array = [];
			App.Each.Of(Original , Item => {
				if(App.Verify.String(Item)){
					App.Array.Push(Array , {
						Url : Item ,
						Method : 'get' ,
					});
				}else if(App.Verify.Object(Item)){
					App.Array.Push(Array , App.Object.Assign(Item , {
						Method : 'get' ,
					}));
				}
				return true;
			});
			return this.Ajax(Array);
		}
		return this.Ajax(App.Object.Assign(Original , {
			Method : 'get' ,
		}));
	}
	Post(Original) {
        if (App.Verify.String(Original)) return this.Ajax({
            Url: Original,
            Method: 'post',
        });
        if (App.Verify.Array(Original)) {
            const Array = [];
            App.Each.Of(Original, Item => {
                if (App.Verify.String(Item)) {
                    App.Array.Push(Array, {
                        Url: Item,
                        Method: 'post',
                    });
                } else if (App.Verify.Object(Item)) {
                    App.Array.Push(Array, App.Object.Assign(Item, {
                        Method: 'post',
                    }));
                }
                return true;
            });
            return this.Ajax(Array);
        }
        return this.Ajax(App.Object.Assign(Original, {
            Method: 'post',
        }));
    }
	Put(Original){
		if(App.Verify.String(Original)) return this.Ajax({
			Url : Original ,
			Method : 'put' ,
		});
		if(App.Verify.Array(Original)){
			const Array = [];
			App.Each.Of(Original , Item => {
				if(App.Verify.String(Item)){
					App.Array.Push(Array , {
						Url : Item ,
						Method : 'put' ,
					});
				}else if(App.Verify.Object(Item)){
					App.Array.Push(Array , App.Object.Assign(Item , {
						Method : 'put' ,
					}));
				}
				return true;
			});
			return this.Ajax(Array);
		}
		return this.Ajax(App.Object.Assign(Original , {
			Method : 'put' ,
		}));
	}
	Delete(Original){
		if(App.Verify.String(Original)) return this.Ajax({
			Url : Original ,
			Method : 'delete' ,
		});
		if(App.Verify.Array(Original)){
			const Array = [];
			App.Each.Of(Original , Item => {
				if(App.Verify.String(Item)){
					App.Array.Push(Array , {
						Url : Item ,
						Method : 'delete' ,
					});
				}else if(App.Verify.Object(Item)){
					App.Array.Push(Array , App.Object.Assign(Item , {
						Method : 'delete' ,
					}));
				}
				return true;
			});
			return this.Ajax(Array);
		}
		return this.Ajax(App.Object.Assign(Original , {
			Method : 'delete' ,
		}));
	}
	Stream(Original){
		if(!App.Verify.Object(Original)) Original = {};
		Option.Link = App.Check(Option.Link , 'Require' , window.location.hostname , 'string');
		Option.Query = App.Check(Option.Query , 'Object' , {});
		if(!App.Verify.Empty(Option.Query)) Option.Link = App.string.Concat(Option.Link , (App.Verify.Eq(App.String.Find.Start(Option.Link , '?') , -1) ? '?' : '&') , App.Object.Url(Option.Query));
		const Resource = new window.EventSource(Option.Link);
		Resource.onopen = Event => {
			if(App.Verify.Function(Option.Open)) Option.Open(Resource , Event);
		};
		Resource.onmessage = Event => {
			if(App.Verify.Function(Option.Message)) Option.Message((() => {
				try{
					return App.String.Json(Event.data);
				}catch{
					return Event.data;
				}
			})() , Resource , Event);
		};
		Resource.onerror = Event => {
			if(App.Verify.Function(Option.Error)) Option.Error(Resource , Event);
		};
	}
	Socket(Original){
		if(!App.Verify.Object(Original)) Original = {};
		Original.Protocol = App.Check(Original.Protocol , 'Boolean' , false);
		Original.Url = App.Check(Original.Url , 'Require' , window.location.hostname , 'string');
		if(App.Verify.Confirm('/' , App.String.Substr(Original.Url , 0 , 1))) Original.Url = App.String.Concat(window.location.hostname , Original.Url);
		if(!App.Verify.Eq(App.String.Find.Start(Original.Url , 'wss://') , 0) && !App.Verify.Eq(App.String.Find.Start(Original.Url , 'ws://') , 0)){
			Original.Url = App.String.Concat((Original.Protocol ? 'wss://' : 'ws://') , Original.Url);
		}else if(Original.Boolean && App.Verify.Eq(App.String.Find.Start(Original.Url , 'ws://') , 0)){
			Original.Url = App.String.Replace(Original.Url , 'ws://' , 'wss://');
		}
		Original.Query = App.Check(Original.Query , 'Object' , {});
		if(!App.Verify.Empty(Original.Query)) Original.Url = App.String.Concat(Original.Url , (App.Verify.Eq(App.String.Find.Start(Original.Url , '?') , -1) ? '?' : '&') , App.Object.Url(Original.Query));
		Original.Repeat = App.Check(Original.Repeat , 'PositiveInteger' , -1);
		Original.Interval = App.Check(Original.Interval , 'PositiveInteger' , 5);
		Original.Uniqid = App.Check(Original.Uniqid , 'String' , '');
		Original.Secret = App.Check(Original.Secret , 'String' , '');
		Original.Append = App.Check(Original.Append , 'String' , '');
		Original.Open = App.Check(Original.Open , 'Function' , () => {});
		Original.Message = App.Check(Original.Message , 'Function' , () => {});
		Original.Close = App.Check(Original.Close , 'Function' , () => {});
		Original.Error = App.Check(Original.Error , 'Function' , () => {});
		Original.Reload = App.Check(Original.Reload , 'Function' , () => {});
		Original.Before = App.Check(Original.Before , 'Function' , Data => {
			return Data;
		});
		Original.After = App.Check(Original.After , 'Function' , () => {});
		Original.Option = {};
		Original.Option.Shutdown = false;
		Original.Option.Count = 1;
		Original.Option.Callback = {};
		Original.Option.Callable = new class {
			Send(Data , Callback){
				if(!App.Verify.Eq(Original.Option.Connect.readyState , 1) || !App.Verify.Object(Data)) return false;
				if(!App.Verify.Empty(Original.Uniqid) && App.Verify.Function(Callback)){
					Data[Original.Uniqid] = App.String.Uniqid();
					Original.Option.Callback[Data[Original.Uniqid]] = Callback;
				}
				let Message = App.Object.Json(Data);
				if(!App.Verify.Empty(Original.Append)) Message = App.String.Concat(Message , Original.Append);
				if(App.Verify.Empty(Original.Secret)){
					Original.Option.Connect.send(Original.Before(Message));
					Original.After();
				}else{
					App.Cypher.Aes.Encode(Message , Original.Secret).then(Content => {
						Original.Option.Connect.send(Original.Before(Content));
						Original.After();
					});
				}
			}
			Close(Callback){
				if(Original.Option.Shutdown) return false;
				Original.Option.Shutdown = true;
				Original.Option.Connect.close();
				if(App.Verify.Function(Callback)) Callback();
			}
		}
		Original.Option.Function = new class {
			Connect(){
				if(App.Verify.Eq(Original.Repeat , 0) || (App.Verify.Gt(Original.Repeat , 0) && App.Verify.Gt(Original.Repeat , Original.Option.Count))) Original.Option.Shutdown = false;
				Original.Option.Connect = new window.WebSocket(Original.Url);
				return this.Open().Receive().Close().Error();
			}
			Open(){
				Original.Option.Connect.onopen = Event => {
					Original.Open(Original.Option.Callable , Event);
				}
				return this;
			}
			Receive(){
				Original.Option.Connect.onmessage = Event => {
					let Data = Event.data;
					if(App.Verify.Empty(Original.Secret)){
						this.Message(Data , Event);
					}else{
						App.Cypher.Aes.Decode(Data , Original.Secret).then(Content => {
							this.Message(Content , Event);
						});
					}
				}
				return this;
			}
			Close(){
				Original.Option.Connect.onclose = Event => {
					if(!Original.Option.Shutdown){
						Original.Close(Event);
						if(App.Verify.Eq(Original.Repeat , 0) || (App.Verify.Gt(Original.Repeat , 0) && App.Verify.Gt(Option.Repeat , Original.Option.Count))){
							Original.Option.Count = App.Calculate.Add(Original.Option.Count , 1);
							Original.Reload(Event);
							App.Aux.Sleep(Original.Interval).then(() => {
								Original.Option.Function.Connect();
							});
						}
					}
					Original.Option.Shutdown = true;
				}
				return this;
			}
			Error(){
				Original.Option.Connect.onerror = Event => {
					Original.Error(Event);
				}
				return true;
			}
			Message(Data , Event){
				const Value = (App.Verify.Empty(Original.Append) ? [Data] : App.String.Split(Data , Original.Append));
				App.Each.Of(Value , Item => {
					if(App.Verify.Empty(Item)) return true;
					if(App.Verify.Empty(Original.Uniqid)){
						Original.Message(this.Change(Item) , Original.Option.Callable , Event);
					}else if(App.Verify.Require(Item[Original.Uniqid] , 'string') && App.Verify.Function(Original.Option.Callback[Item[Original.Uniqid]])){
						Original.Option.Callback[Item[Original.Uniqid]](this.Change(Item) , Original.Option.Callable , Event);
						delete Original.Option.Callback[Item[Original.Uniqid]];
					}
				});
			}
			Change(Data){
				try{
					return App.String.Json(Data);
				}catch{
					return Data;
				}
			}
		}
		return Original.Option.Function.Connect();
	}
}