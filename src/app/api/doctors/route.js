// pages/api/doctors.ts
import prisma from '../../lib/prisma';


export async function GET(request) {
  const doctors = await prisma.doctor.findMany({
    select: {
      id: true,
      name: true,
      ability: true,
      description: true,
      province: true,
      phoneNumber: true,
      createdAt: true,
    },
  });
  return new Response(JSON.stringify(doctors));
}
 
