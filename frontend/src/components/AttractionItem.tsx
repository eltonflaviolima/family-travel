import React from "react";

export default function AttractionItem({ attraction }: any) {
return (
<div>
<p>{attraction.id} - {attraction.name}</p>
</div>
);
}