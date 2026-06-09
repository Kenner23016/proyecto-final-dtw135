self.onmessage=function(e){
 const productos=e.data||[];
 setTimeout(()=>{
  let duplicados=0, stockBajo=0, sinCategoria=0;
  const recomendaciones=[];
  const codigos=new Set();
  const categorias=new Set();
  let productoMasCaro=null, productoMasBarato=null, productoMayorStock=null, productoMenorStock=null;

  productos.forEach(p=>{
    if(codigos.has(p.codigo)) duplicados++;
    codigos.add(p.codigo);

    const precio=Number(p.precio)||0;
    const cantidad=Number(p.cantidad)||0;

    if(cantidad<=5){
      stockBajo++;
      recomendaciones.push({nombre:p.nombre, stock:cantidad});
    }

    if(!p.categoria || !String(p.categoria).trim()) {
      sinCategoria++;
    } else {
      categorias.add(p.categoria);
    }

    if(!productoMasCaro || precio > (Number(productoMasCaro.precio)||0)) productoMasCaro=p;
    if(!productoMasBarato || precio < (Number(productoMasBarato.precio)||0)) productoMasBarato=p;
    if(!productoMayorStock || cantidad > (Number(productoMayorStock.cantidad)||0)) productoMayorStock=p;
    if(!productoMenorStock || cantidad < (Number(productoMenorStock.cantidad)||0)) productoMenorStock=p;
  });

  self.postMessage({
    duplicados,
    stockBajo,
    sinCategoria,
    totalProductos: productos.length,
    categoriasRegistradas: categorias.size,
    productoMasCaro,
    productoMasBarato,
    productoMayorStock,
    productoMenorStock,
    recomendaciones,
    fecha: new Date().toLocaleString()
  });
 },2000);
};