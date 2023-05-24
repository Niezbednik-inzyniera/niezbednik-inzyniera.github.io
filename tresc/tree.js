/**
 * @author Sławomir Kokłowski {@link https://www.kurshtml.edu.pl}
 * @copyright NIE usuwaj tego komentarza! (Do NOT remove this comment!)
 */

function Tree(id)
{
	this.id = id;
	
	var url = unescape(window.location.href.replace(/#.*/, ''));
	var base = window.location.protocol + '//' + window.location.host + window.location.pathname.replace(/[^\/\\]+$/, '');
	
	this.click = function ()
	{
		for (var i = 0, el_node; i < this.parentNode.childNodes.length; i++)
		{
			el_node = this.parentNode.childNodes.item(i)
			if (el_node.nodeName.toLowerCase() == 'ul')
			{
				el_node.style.display = el_node.style.display == 'none' ? 'block' : 'none';
				this.parentNode.className = this.parentNode.className.replace(/(^| +)(opened|closed)( +|$)/g, ' ') + ' ' + (el_node.style.display == 'none' ? 'closed' : 'opened');
				return;
			}
		}
	}
	
	this.start = function (el)
	{
		for (var i = 0, el_node; i < el.childNodes.length; i++)
		{
			el_node = el.childNodes.item(i);
			if (el_node.nodeName.toLowerCase() == 'a')
			{
				el_node.onclick = this.click;
				for (var j = 0; j < el_node.parentNode.childNodes.length; j++)
				{
					if (el_node.parentNode.childNodes.item(j).nodeName.toLowerCase() == 'ul')
					{
						el_node.parentNode.className += ' closed';
						el_node.className = (el_node.className ? el_node.className + ' ' : '') + 'folder';
						break;
					}
					if (el_node.parentNode.childNodes.item(j).nodeName.toLowerCase() == 'li') break;
				}
				var active = el_node.href && unescape(el_node.href.replace(/#.*/, '')) == url;
				if (!active)
				{
					var rel = el_node.getAttribute('rel');
					if (rel)
					{
						var matches = (' ' + rel + ' ').match(/\s+Collection\(([^)]+)\)\s+/i);
						if (matches)
						{
							matches = matches[1].split(',');
							for (var k = 0, pos = -1; k < matches.length; k++)
							{
								if (matches[k].charAt(0) == '[' && (pos = matches[k].lastIndexOf(']')) > 0)
								{
									if (new RegExp(unescape(matches[k].substring(1, pos)), matches[k].substring(pos + 1)).test(url))
									{
										active = true;
										break;
									}
								}
								else
								{
									if (/^[\/\\]/.test(matches[k])) matches[k] = window.location.protocol + '//' + window.location.host + matches[k];
									else if (!/^[a-z0-9]+:/i.test(matches[k])) matches[k] = base + matches[k];
									if (unescape(matches[k].replace(/[\/\\]\.([\/\\])/g, '$1').replace(/[^\/\\]+[\/\\]\.\.[\/\\]/g, '').replace(/#.*/, '')) == url)
									{
										active = true;
										break;
									}
								}
							}
						}
					}
				}
				if (active)
				{
					el_node.className = 'active';
					var el_parentNode = el_node;
					do
					{
						el_parentNode = el_parentNode.parentNode;
						if (el_parentNode.nodeName.toLowerCase() == 'ul')
						{
							el_parentNode.style.display = 'block';
							if (document.getElementById(this.id) != el_parentNode) el_parentNode.parentNode.className = el_parentNode.parentNode.className.replace(/(^| +)(opened|closed)( +|$)/g, ' ') + ' opened';
						}
					}
					while (document.getElementById(this.id) != el_parentNode)
				}
			}
			else if (el_node.nodeName.toLowerCase() == 'ul') el_node.style.display = 'none';
			this.start(el_node);
		}
	}
	
	if (document.getElementById && document.childNodes) this.start(document.getElementById(this.id));
}