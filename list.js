(function()
{
	// 最後のスクロール位置を保存するイベント

	window.addEventListener("pagehide",	function()
	{
		// filter-listの０番目の要素のクラスにfilter-selectedが含まれていれば（すべてが選択されていれば）
		if(document.getElementById("filter-list").children[0].classList.contains("filter-selected"))
		{
			localStorage.setItem("pageYOffset", pageYOffset);
		}
		else
		{
			localStorage.removeItem("pageYOffset");
		}
		return;
	});
	const scrollTime = 500;
	// 最後のスクロール位置を取得
	const lastPageYOffset = 0 + localStorage.getItem("pageYOffset");
	// spread sheetからjsonを取得する処理
	const xhr = new XMLHttpRequest();
	// onloadを設定
	xhr.onload = function()
	{
		if(xhr.readyState === 4 && xhr.status === 200)
		{
			// jsonを正常にロードできたら、必要な部分を取り出して表を作る
			list(JSON.parse(xhr.responseText).feed.entry);
			// clubNameUniqueArrayをソートする
			clubNameUniqueArray.sort();
			createFilter();
			// 最後のスクロール位置を復元する
			restorePageOffset();
		}
	};
	xhr.open("GET", "https://spreadsheets.google.com/feeds/list/1ahI3h-FQZHUmQ9LH-X5wdtjHJHSZm1wsBtbcka3MBY0/od6/public/values?alt=json", true);
	xhr.send();
	// spread sheetからjsonを取得する処理ここまで
	
	const clubNameUniqueArray = [];
	
	// 表を作る関数
	function list(json)
	{
		// 行を一つずつ取り出す
		for(const row of json)
		{
			// jsonのキーを毎回書くのがクソだるいので糖衣関数を作成した
			function getValue(key)
			{
				return row["gsx$"+key].$t;
			}
			// それぞれの人の情報を入れる箱
			const box = document.createElement("div");
			box.classList.add("member-list-box");
			box.style.backgroundColor = getValue("csscolor");
			document.getElementById("member-list").appendChild(box);
			
			// アイコン
			const icon = document.createElement("img");
			icon.src = getValue("画像url");
			icon.classList.add("profile-image");
			box.appendChild(icon);
			
			// プロフィールを入れる箱
			const profile = document.createElement("div");
			profile.classList.add("profile");
			box.appendChild(profile);
			
			const name = document.createElement("div");
			name.textContent = "名前：" + getValue("名前");
			profile.appendChild(name);
			
			const vrchat = document.createElement("div");
			vrchat.textContent = "VRChatID：" + getValue("vrchatid");
			profile.appendChild(vrchat);
			
			const twitterID = getValue("twitterid");
			const twitterLink = document.createElement("a");
			const twitter = document.createElement("div");
			twitterLink.textContent = "TwitterID：" + twitterID;
			twitterLink.href = "https://twitter.com/" + twitterID;
			twitter.appendChild(twitterLink);
			profile.appendChild(twitter);
			
			const language = document.createElement("div");
			language.textContent = "言語：" + getValue("言語");
			profile.appendChild(language);
			
			const production = document.createElement("div");
			production.textContent = "好きな作品：" + getValue("好きな作品");
			profile.appendChild(production);
			
			const game = document.createElement("div");
			game.textContent = "好きなゲーム：" + getValue("好きなゲーム");
			profile.appendChild(game);
			
			const challenge = document.createElement("div");
			challenge.textContent = "やりたいこと：" + getValue("やりたいこと");
			profile.appendChild(challenge);
			
			const attribute = document.createElement("div");
			attribute.textContent = "好きな属性：" + getValue("好きな属性");
			profile.appendChild(attribute);
			
			const move = document.createElement("div");
			move.textContent = "得意ムーブ：" + getValue("得意ムーブ");
			profile.appendChild(move);
			
			const whatisAvatar = document.createElement("div");
			whatisAvatar.textContent = "アバターとは：" + getValue("アバターとは");
			profile.appendChild(whatisAvatar);
			
			const foodVector = document.createElement("div");
			foodVector.textContent = "食べ物の方向性：" + getValue("食べ物の方向性");
			profile.appendChild(foodVector);
			
			const food = document.createElement("div");
			food.textContent = "好きな食べ物：" + getValue("好きな食べ物");
			profile.appendChild(food);
			
			const role = document.createElement("div");
			role.textContent = "役割：" + getValue("役割");
			profile.appendChild(role);
			
			const clubs = document.createElement("div");
			clubs.textContent = "◆部活";
			profile.appendChild(clubs);
			
			const clubList = document.createElement("ul");
			clubList.classList.add("clubs");
			clubs.appendChild(clubList);
			
			// 部活カラムの文字列を","で区切って配列にしたものを順に処理する
			for(const clubName of getValue("部活").split(","))
			{
				// 部活名が無ければスキップする
				if(clubName.trim().length === 0)continue;
				// 要素追加
				const li = document.createElement("li");
				li.classList.add("club");
				li.textContent = clubName;
				clubList.appendChild(li);
				// clubNameUniqueArrayに部活名が無ければ追加する
				if(clubNameUniqueArray.indexOf(clubName) === -1)
				{
					clubNameUniqueArray.push(clubName);
				}
			}
		}
	}
	
	// フィルタを作る関数
	function createFilter()
	{
		// すべて表示を追加する（0番目は"すべてフィルタ"）
		clubNameUniqueArray.unshift("すべて");
		for(const clubName of clubNameUniqueArray)
		{
			const li = document.createElement("li");
			li.classList.add("club");
			li.textContent = clubName;
			
			// 要素クリックでフィルタを選ぶ
			li.addEventListener("click",function(e)
			{
				selectFilter(this);
			});
			document.getElementById("filter-list").appendChild(li);
		}
		// 最初のフィルタを選択状態にする
		selectFilter(document.getElementById("filter-list").children[0]);

	}
	
	// フィルタを選ぶ（引数はフィルタ要素） 
	function selectFilter(elm)
	{
		// 今選択中のフィルタを選択してない状態にする
		// 要素数0の時に対応するために拡張for文使用
		for(const x of document.getElementsByClassName("filter-selected"))
		{
			x.classList.remove("filter-selected");
		}
		// フィルタを選択状態にする
		elm.classList.add("filter-selected");
		
		// プロフィール人数分処理する
		for(const box of document.getElementsByClassName("member-list-box"))
		{
			// フィルタの文字列が0番目の文字列と同じなら全部表示する（すべて表示状態）
			if(elm.textContent === document.getElementById("filter-list").children[0].textContent)
			{
				box.classList.remove("hide");
				continue;
			}
			// 上のif文の条件外なら以下の無名関数を実行する
			(function()
			{
				// 部活リストにフィルタと同じものがあれば非表示クラスを外して終わる
				for(const x of box.getElementsByClassName("club"))
				{
					if(x.textContent === elm.textContent)
					{
						box.classList.remove("hide");
						return;
					}
				}
				// 非表示クラスを付ける
				box.classList.add("hide");
			})();
		}
	}
	function restorePageOffset()
	{
		const startTime = new Date();
		const scrollTime = 500;
		function ease(p)
		{
			return (0.5 - Math.cos(p * Math.PI) / 2); // swing
		}
		function move()
		{
			const p = (new Date() - startTime) / scrollTime;
			const y = lastPageYOffset * ease(p < 0.99?p:1);
			window.scroll(0, y);
			if(pageYOffset < lastPageYOffset)
			{
				requestAnimationFrame(move);
			}
		}
		requestAnimationFrame(move);
	}
})();
