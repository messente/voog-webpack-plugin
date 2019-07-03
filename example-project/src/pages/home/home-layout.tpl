<!doctype html>
<html lang="en">
<head>
  <!-- Include a template file with HtmlWebpackPlugin that will be injected to layout before uploaded to Voog -->
  ${require('@app/shared/meta-tags.tpl')}
</head>
<body>

<!-- Include a component in Voog markup. Layout and component files are uploaded to Voog separately -->
{% include 'footer-component.tpl' %}

<h1>Home layout</h1>

<!-- You can still use Voog Markup in the template -->
<h2>{% content name="page_subtitle" single="plaintext" %}</h2>

<img src="${require('@images/icon-square-big.svg')}" alt="Magic of WebPack">

</body>
</html>
