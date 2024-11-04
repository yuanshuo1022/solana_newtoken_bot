export default new class {
	async Waiting(Original , Callable){
		let Boolean = true;
		for(const Item of Original){
			if(App.Verify.Function(Callable)) Boolean = await Callable(Item);
			if(App.Verify.Boolean(Boolean) && !Boolean) break;
		}
	}
	In(Original , Callable){
		let Boolean = true;
		for(const Index in Original){
			if(App.Verify.Function(Callable)) Boolean = Callable(Original[Index] , Index);
			if(App.Verify.Boolean(Boolean) && !Boolean) break;
		}
	}
	Of(Original , Callable){
		let Boolean = true;
		for(const Item of Original){
			if(App.Verify.Function(Callable)) Boolean = Callable(Item);
			if(App.Verify.Boolean(Boolean) && !Boolean) break;
		}
	}
	Loop(Start , End , Step){
		const Option = {};
		Option.Start = App.Check(Start , 'Number' , 0);
		Option.End = App.Check(End , 'Number' , 0);
		Option.Step = App.Check(Step , 'Number' , 1);
		Option.Boolean = true;
		return new class {
			Add(Callable){
				for(let Index = Option.Start; Index < Option.End; Index = App.Calculate.Add(Index , Option.Step)){
					if(App.Verify.Function(Callable)) Option.Boolean = Callable(Index);
					if(App.Verify.Boolean(Option.Boolean) && !Option.Boolean) break;
					if(App.Verify.Number(Option.Boolean)) Index = Option.Boolean;
				}
			}
			Sub(Callable){
				for(let Index = Option.Start; Index > Option.End; Index = App.Calculate.Sub(Index , Option.Step)){
					if(App.Verify.Function(Callable)) Option.Boolean = Callable(Index);
					if(App.Verify.Boolean(Option.Boolean) && !Option.Boolean) break;
					if(App.Verify.Number(Option.Boolean)) Index = Option.Boolean;
				}
			}
			Mul(Callable){
				for(let Index = Option.Start; Index < Option.End; Index = App.Calculate.Mul(Index , Option.Step)){
					if(App.Verify.Function(Callable)) Option.Boolean = Callable(Index);
					if(App.Verify.Boolean(Option.Boolean) && !Option.Boolean) break;
					if(App.Verify.Number(Option.Boolean)) Index = Option.Boolean;
				}
			}
			Div(Callable){
				for(let Index = Option.Start; Index > Option.End; Index = App.Calculate.Div(Index , Option.Step)){
					if(App.Verify.Function(Callable)) Option.Boolean = Callable(Index);
					if(App.Verify.Boolean(Option.Boolean) && !Option.Boolean) break;
					if(App.Verify.Number(Option.Boolean)) Index = Option.Boolean;
				}
			}
		}
	}
}