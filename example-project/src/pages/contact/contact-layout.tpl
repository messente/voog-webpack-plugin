<!doctype html>
<html lang="en">
<head>
  <!-- Include a template file with HtmlWebpackPlugin that will be injected to layout before uploaded to Voog -->
  ${require('@app/shared/meta-tags.tpl')}
</head>
<body>

<!-- Include a component in Voog markup. Layout and component files are uploaded to Voog separately -->
{% include 'footer-component.tpl' %}

<h1>Contact layout</h1>

</body>
</html>
