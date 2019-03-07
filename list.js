(function()
{
	console.log("xhr start");
	const xhr = new XMLHttpRequest();
	xhr.onload = function()
	{
		if(xhr.readyState === 4 && xhr.status === 200)
		{
			list(JSON.parse(xhr.responseText).feed.entry);
		}
	};
	xhr.open("GET", "https://spreadsheets.google.com/feeds/list/1ahI3h-FQZHUmQ9LH-X5wdtjHJHSZm1wsBtbcka3MBY0/od6/public/values?alt=json", true);
	xhr.send();
	function list(json)
	{
		console.log(json);
		for(const row of json)
		{
			function getValue(key)
			{
				return row["gsx$"+key].$t;
			}
			const box = document.createElement("div");
			box.classList.add("list-box");
			box.style.backgroundColor = getValue("csscolor");
			document.getElementById("member-list").appendChild(box);
			
			const innerBox = document.createElement("div");
			innerBox.classList.add("inner-box");
			box.appendChild(innerBox);
			
			const icon = document.createElement("img");
			icon.src = getValue("画像url");
			innerBox.appendChild(icon);
			
			const profile = document.createElement("div");
			profile.classList.add("profile");
			innerBox.appendChild(profile);
			
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
			clubs.classList.add("club");
			clubs.textContent = "◆部活";
			profile.appendChild(clubs);
			const clubList = document.createElement("ul");
			clubs.appendChild(clubList);
			
			for(const clubName of getValue("部活").split(","))
			{
				if(clubName.length === 0)continue;
				const li = document.createElement("li");
				li.textContent = clubName;
				clubList.appendChild(li);
			}
		}
	}
})();
