export default new class {
	Push(Original , ...Additional){
		return this.Splice(Original , App.Length(Original) , 0 , ...Additional);
	}
	Delete(Original , Index , Length){
		return this.Splice(Original , Index , Length);
	}
	Splice(Original , Index , Length , ...Additional){
		return Original.splice(App.Number.Convert(App.Check(Index , 'Integer' , 0)) , App.Number.Convert(App.Check(Length , 'Integer' , 0)) , ...Additional);
	}
	Join(Original , Symbol){
		return Original.join(App.Check(Symbol , 'String' , ''));
	}
	Concat(Original , ...Additional){
		return Original.concat(...Additional);
	}
	Deduplication(Original){
		const Data = [];
		App.Each.Of(Original , Item => {
			if(!App.Verify.In(Data , Item)) this.Push(Data , Item);
			return true;
		});
		return Data;
	}
	Flat(Original , Level){
		return Original.flat(App.Number.Convert(App.Check(Level , 'Integer' , 1)));
	}
	Reverse(Original){
		return Original.reverse();
	}
	Shuffle(Original){
		return this.Order(Original , () => {
			return App.Calculate.Sub(window.Math.random() , 0.5);
		});
	}
	Order(Original , Callable){
		return Original.sort((Current , Next) => {
			if(App.Verify.Function(Callable)) return Callable(Current , Next);
			if(App.Verify.Gt(Current , Next)) return 1;
			if(App.Verify.Lt(Current , Next)) return -1;
			return 0;
		});
	}
}